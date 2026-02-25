// DCMap.tsx — Google Maps integration via @react-google-maps/api
// Same DCMapMarker interface as before — zero changes required in any screen.
// API key: AIzaSyDOQoeCNbU_A6r9pF75EjmhG4eQVoq8sjQ

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import {
  GoogleMap,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useTheme } from "../ThemeContext";

const GOOGLE_MAPS_API_KEY = "AIzaSyDOQoeCNbU_A6r9pF75EjmhG4eQVoq8sjQ";

// ─── Inject pulse CSS once ────────────────────────────────────────
function injectStyles() {
  if (document.getElementById("dc-map-css")) return;
  const s = document.createElement("style");
  s.id = "dc-map-css";
  s.textContent = `
    @keyframes dcPulse {
      0%,100% { transform:translate(-50%,-50%) scale(1);   opacity:0.55; }
      60%      { transform:translate(-50%,-50%) scale(2.8); opacity:0;    }
    }
    .dc-pulse { animation: dcPulse 2.2s ease-out infinite; }
  `;
  document.head.appendChild(s);
}

// ─── Dark map style — matches DC Color #0C0C0A canvas ────────────
const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",                                            stylers: [{ color: "#0D0D0B" }] },
  { elementType: "labels.text.fill",                                    stylers: [{ color: "#525250" }] },
  { elementType: "labels.text.stroke",                                  stylers: [{ color: "#0D0D0B" }] },
  { featureType: "administrative",      elementType: "geometry",        stylers: [{ color: "#1A1A17" }] },
  { featureType: "administrative",      elementType: "labels",          stylers: [{ visibility: "simplified" }] },
  { featureType: "road",                elementType: "geometry",        stylers: [{ color: "#1E1E1B" }] },
  { featureType: "road",                elementType: "geometry.stroke", stylers: [{ color: "#0D0D0B" }] },
  { featureType: "road",                elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "road.local",          elementType: "geometry",        stylers: [{ color: "#161613" }] },
  { featureType: "road.arterial",       elementType: "geometry",        stylers: [{ color: "#272724" }] },
  { featureType: "road.highway",        elementType: "geometry",        stylers: [{ color: "#0E1E2E" }] },
  { featureType: "road.highway",        elementType: "geometry.stroke", stylers: [{ color: "#162538" }] },
  { featureType: "road.highway",        elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "water",               elementType: "geometry",        stylers: [{ color: "#060608" }] },
  { featureType: "water",               elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "poi.park",            elementType: "geometry.fill",   stylers: [{ color: "#0F2012" }] },
  { featureType: "poi.park",            elementType: "geometry.stroke", stylers: [{ color: "#142616" }] },
  { featureType: "poi.park",            elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "poi",                                                  stylers: [{ visibility: "off" }] },
  { featureType: "transit",                                              stylers: [{ visibility: "off" }] },
  { featureType: "landscape",           elementType: "geometry",        stylers: [{ color: "#0D0D0B" }] },
  { featureType: "landscape.natural",   elementType: "geometry",        stylers: [{ color: "#111110" }] },
];

// ─── Light map style — matches DC Color light canvas ─────────────
const LIGHT_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",                                            stylers: [{ color: "#E5E3DA" }] },
  { elementType: "labels.text.fill",                                    stylers: [{ color: "#6C6A62" }] },
  { elementType: "labels.text.stroke",                                  stylers: [{ color: "#E5E3DA" }] },
  { featureType: "road",                elementType: "geometry",        stylers: [{ color: "#CCCAC2" }] },
  { featureType: "road",                elementType: "geometry.stroke", stylers: [{ color: "#D8D6CE" }] },
  { featureType: "road",                elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial",       elementType: "geometry",        stylers: [{ color: "#BFBDB5" }] },
  { featureType: "road.highway",        elementType: "geometry",        stylers: [{ color: "#A6A49E" }] },
  { featureType: "road.highway",        elementType: "geometry.stroke", stylers: [{ color: "#B4B2AC" }] },
  { featureType: "road.highway",        elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "water",               elementType: "geometry",        stylers: [{ color: "#C8D8E4" }] },
  { featureType: "water",               elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "poi.park",            elementType: "geometry",        stylers: [{ color: "#C4D9BA" }] },
  { featureType: "poi.park",            elementType: "geometry.stroke", stylers: [{ color: "#B8CEAE" }] },
  { featureType: "poi",                                                  stylers: [{ visibility: "off" }] },
  { featureType: "transit",                                              stylers: [{ visibility: "off" }] },
  { featureType: "landscape",           elementType: "geometry",        stylers: [{ color: "#E5E3DA" }] },
];

// ─── Types ────────────────────────────────────────────────────────
export interface DCMapMarker {
  position:     [number, number]; // [lat, lng]
  type:         "user" | "vendor";
  initials?:    string;
  avatarColor?: string;
  rating?:      string;
}

interface DCMapProps {
  center?:      [number, number];
  zoom?:        number;
  markers?:     DCMapMarker[];
  panTarget?:   [number, number];
  style?:       React.CSSProperties;
  interactive?: boolean;
}

// ─── User location marker ─────────────────────────────────────────
function UserMarker() {
  return (
    <div
      style={{
        position: "relative",
        width: 22,
        height: 22,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      {/* Pulse ring */}
      <div
        className="dc-pulse"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.4)",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      {/* Solid dot */}
      <div
        style={{
          position: "absolute",
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid #111",
          boxShadow: "0 1px 8px rgba(0,0,0,0.8)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─── Vendor avatar marker (matches Figma Make spec exactly) ──────
function VendorMarker({
  initials = "V", avatarColor = "#2E93FA", rating, index,
}: { initials?: string; avatarColor?: string; rating?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 400, damping: 22 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        transform: "translate(-50%, -100%)",
        pointerEvents: "none",
      }}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          backgroundColor: avatarColor,
          border: "2.5px solid rgba(13,13,13,0.92)",
          boxShadow: `0 0 0 1.5px ${avatarColor}55, 0 4px 14px rgba(0,0,0,0.55)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#000000",
            fontSize: 11,
            fontWeight: 800,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {initials}
        </span>
      </div>
      {/* Rating chip — below circle, only shown when rating provided */}
      {rating && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            backgroundColor: "rgba(13,13,13,0.88)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 9999,
            paddingLeft: 5,
            paddingRight: 6,
            paddingTop: 2,
            paddingBottom: 2,
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: 8, lineHeight: 1 }}>⭐</span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {rating}
          </span>
        </div>
      )}
      {/* Tail dot */}
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: avatarColor,
          boxShadow: `0 1px 6px ${avatarColor}99`,
        }}
      />
    </motion.div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────
function MapSkeleton({ isDark, style }: { isDark: boolean; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isDark ? "#0D0D0B" : "#E5E3DA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {/* Subtle pulsing grid lines — echoes the old SVG map during load */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid ${isDark ? "rgba(255,77,0,0.4)" : "rgba(255,77,0,0.35)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#FF4D00",
            opacity: 0.8,
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function DCMap({ center, zoom, markers = [], style }: DCMapProps) {
  const { isDark } = useTheme();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "dc-google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Inject pulse CSS as soon as component mounts
  const didInject = useRef(false);
  if (!didInject.current) {
    didInject.current = true;
    injectStyles();
  }

  const mapCenter = {
    lat: center?.[0] ?? 33.7490,
    lng: center?.[1] ?? -84.3882,
  };

  const mapOptions: google.maps.MapOptions = {
    styles:              isDark ? DARK_STYLES : LIGHT_STYLES,
    disableDefaultUI:   true,
    gestureHandling:    "greedy",
    clickableIcons:     false,
    keyboardShortcuts:  false,
    zoomControl:        false,
    mapTypeControl:     false,
    streetViewControl:  false,
    fullscreenControl:  false,
    rotateControl:      false,
    scaleControl:       false,
  };

  const onLoad = useCallback((_map: google.maps.Map) => {
    // Map instance available here if needed for imperative control
  }, []);

  if (loadError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "#0D0D0B" : "#E5E3DA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        <span style={{ color: "rgba(255,77,0,0.6)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
          Map unavailable
        </span>
      </div>
    );
  }

  if (!isLoaded) {
    return <MapSkeleton isDark={isDark} style={style} />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={zoom ?? 13}
        options={mapOptions}
        onLoad={onLoad}
      >
        {markers.map((m, i) => (
          <OverlayView
            key={i}
            position={{ lat: m.position[0], lng: m.position[1] }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            {m.type === "user" ? (
              <UserMarker />
            ) : (
              <VendorMarker
                initials={m.initials}
                avatarColor={m.avatarColor}
                rating={m.rating}
                index={i}
              />
            )}
          </OverlayView>
        ))}
      </GoogleMap>
    </div>
  );
}