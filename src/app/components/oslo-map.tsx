import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { osloDistrictsGeoJSON } from "./oslo-districts-geojson";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZHJza2plbGRlIiwiYSI6ImNtazh0MmJ2aDFoMjUzZXNjMWg5Z2N6aGEifQ.MwnR35CAROeK21aodZ78hw";
const MAPBOX_STYLE = "mapbox://styles/drskjelde/cmlurenq0002901quem1e7xxw";

interface OsloMapProps {
  selectedDistrict: string | null;
  hoveredDistrict: string | null;
  onSelectDistrict: (id: string | null) => void;
  onHoverDistrict: (id: string | null) => void;
}

export function OsloMap({
  selectedDistrict,
  hoveredDistrict,
  onSelectDistrict,
  onHoverDistrict,
}: OsloMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const selectedRef = useRef(selectedDistrict);
  const hoveredRef = useRef(hoveredDistrict);

  selectedRef.current = selectedDistrict;
  hoveredRef.current = hoveredDistrict;

  const updatePaint = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("districts-fill")) return;

    const selected = selectedRef.current ?? "";
    const hovered = hoveredRef.current ?? "";

    map.setPaintProperty("districts-fill", "fill-color", [
      "case",
      ["==", ["get", "id"], selected],
      "rgba(28, 37, 50, 0.9)",
      ["==", ["get", "id"], hovered],
      "rgba(28, 37, 50, 0.7)",
      "rgba(17, 23, 32, 0.5)",
    ]);

    map.setPaintProperty("districts-line", "line-color", [
      "case",
      ["==", ["get", "id"], selected],
      "rgba(96, 165, 250, 0.8)",
      ["==", ["get", "id"], hovered],
      "rgba(90, 103, 120, 0.6)",
      "rgba(48, 58, 72, 0.4)",
    ]);

    map.setPaintProperty("districts-line", "line-width", [
      "case",
      ["==", ["get", "id"], selected],
      2,
      1,
    ]);

    map.setPaintProperty("districts-label", "text-color", [
      "case",
      [
        "any",
        ["==", ["get", "id"], selected],
        ["==", ["get", "id"], hovered],
      ],
      "rgba(255, 255, 255, 0.95)",
      "rgba(203, 213, 225, 0.7)",
    ]);
  }, []);

  useEffect(() => {
    updatePaint();
  }, [selectedDistrict, hoveredDistrict, updatePaint]);

  useEffect(() => {
    if (selectedDistrict && mapRef.current) {
      const feature = osloDistrictsGeoJSON.features.find(
        (f) => f.properties.id === selectedDistrict
      );
      if (feature) {
        const coords = feature.geometry.coordinates[0];
        const lngs = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        mapRef.current.flyTo({ center: [centerLng, centerLat], zoom: 12.5, duration: 800 });
      }
    } else if (!selectedDistrict && mapRef.current) {
      mapRef.current.flyTo({ center: [10.77, 59.92], zoom: 11, duration: 800 });
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: [10.77, 59.92],
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("districts", {
        type: "geojson",
        data: osloDistrictsGeoJSON as GeoJSON.FeatureCollection,
      });

      map.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: {
          "fill-color": "rgba(17, 23, 32, 0.5)",
          "fill-opacity": 0.7,
        },
      });

      map.addLayer({
        id: "districts-line",
        type: "line",
        source: "districts",
        paint: {
          "line-color": "rgba(48, 58, 72, 0.4)",
          "line-width": 1,
        },
      });

      map.addLayer({
        id: "districts-label",
        type: "symbol",
        source: "districts",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-letter-spacing": 0.05,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "rgba(203, 213, 225, 0.7)",
          "text-halo-color": "rgba(0, 0, 0, 0.6)",
          "text-halo-width": 1,
        },
      });

      updatePaint();

      map.on("click", "districts-fill", (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          const id = feature.properties.id;
          onSelectDistrict(id === selectedRef.current ? null : id);
        }
      });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["districts-fill"],
        });
        if (!features.length) {
          onSelectDistrict(null);
        }
      });

      map.on("mousemove", "districts-fill", (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onHoverDistrict(feature.properties.id);
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", "districts-fill", () => {
        onHoverDistrict(null);
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
