import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  encodedPolyline: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ encodedPolyline }) => {
  const decodedPath: [number, number][] = polyline.decode(encodedPolyline);

  const bounds = decodedPath.length > 0 ? decodedPath : [[0, 0]];
  const startPosition = decodedPath[0];
  const endPosition = decodedPath[decodedPath.length - 1];

  return (
    <MapContainer bounds={bounds} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={decodedPath} pathOptions={{ color: 'blue' }} />

      {startPosition && (
        <Marker position={startPosition}>
          <div className="bg-green text-black p-1 rounded">Início</div>
        </Marker>
      )}
      {endPosition && (
        <Marker position={endPosition}>
          <div className="bg-white text-black p-1 rounded">Fim</div>
        </Marker>
      )}
    </MapContainer>
  );
};
