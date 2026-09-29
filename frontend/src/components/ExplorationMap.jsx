import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom dark marker icon using Leaflet CDN assets with CSS filter or custom SVG marker
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -38],
  shadowSize: [45, 45]
});

// Component to handle clicks directly on the map surface
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({
        siteId: `Custom_${lat.toFixed(3)}_${lng.toFixed(3)}`,
        site_name: `Selected Region (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
        district: "Geospatial Selection",
        state: "Odisha Region",
        latitude: parseFloat(lat.toFixed(4)),
        longitude: parseFloat(lng.toFixed(4))
      });
    }
  });
  return null;
}

export default function ExplorationMap({ sites, selectedSite, onSelectSite }) {
  const centerPosition = [
    selectedSite?.latitude || 21.8945,
    selectedSite?.longitude || 85.4295
  ];

  return (
    <div className="map-container-wrapper">
      <div className="map-instructions-overlay">
        <span>● Click any marker or map area to analyze prospectivity</span>
      </div>

      <MapContainer
        center={centerPosition}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onLocationSelect={onSelectSite} />

        {/* Render sites from PostgreSQL/PostGIS */}
        {sites && sites.map((site) => {
          const lat = parseFloat(site.latitude);
          const lon = parseFloat(site.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;

          const isSelected = selectedSite && (
            selectedSite.id === site.id || 
            selectedSite.site_name === site.site_name
          );

          return (
            <Marker
              key={site.id || site.site_name}
              position={[lat, lon]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onSelectSite(site)
              }}
            >
              <Popup className="dark-popup">
                <div style={{ padding: '4px 2px' }}>
                  <strong style={{ color: '#10b981', fontSize: '14px' }}>{site.site_name}</strong>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                    {site.district}, {site.state}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Lat: {lat} | Lon: {lon}
                  </div>
                  <div style={{ fontSize: '10px', color: '#34d399', marginTop: '6px', fontWeight: 'bold' }}>
                    Mineral: {site.mineral_type || 'Manganese'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* If selected position is a custom clicked position not in backend sites list */}
        {selectedSite && !sites.some(s => s.latitude === selectedSite.latitude && s.longitude === selectedSite.longitude) && (
          <Marker
            position={[selectedSite.latitude, selectedSite.longitude]}
            icon={selectedIcon}
          >
            <Popup>
              <div>
                <strong style={{ color: '#f59e0b' }}>{selectedSite.site_name}</strong>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Lat: {selectedSite.latitude} | Lon: {selectedSite.longitude}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
