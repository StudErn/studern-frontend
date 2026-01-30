import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to capture map instance
function MapInitializer({ setMapInstance }) {
  const map = useMap();
  
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} />;
}

const MapPicker = ({ latitude, longitude, onLocationChange }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Use ref to store the latest callback
  const onLocationChangeRef = useRef(onLocationChange);

  // Update ref when callback changes
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  // Initialize position from props
  useEffect(() => {
    if (latitude && longitude) {
      setPosition({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    } else {
      // Default to Dhaka, Bangladesh
      setPosition({ lat: 23.8103, lng: 90.4125 });
    }
  }, [latitude, longitude]);

  // Update parent when position changes
  useEffect(() => {
    if (position) {
      onLocationChangeRef.current(position.lat, position.lng);
    }
  }, [position]);

  // Handle search using Nominatim API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setShowResults(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle result selection
  const handleResultSelect = (result) => {
    const newPosition = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    setPosition(newPosition);
    setShowResults(false);
    setSearchQuery(result.display_name);

    // Pan map to selected location with zoom
    if (mapInstance) {
      mapInstance.setView(newPosition, 15);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search for a location (e.g., '123 Main St, New York' or 'Empire State Building')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={searching}
            className="px-6 py-3 bg-[#00B8D4] text-white rounded-lg font-semibold hover:bg-[#0097a7] transition disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleResultSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <p className="text-sm font-medium text-gray-900">
                  {result.display_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {parseFloat(result.lat).toFixed(4)}, Lng:{' '}
                  {parseFloat(result.lon).toFixed(4)}
                </p>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && !searching && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500">No results found. Try a different search.</p>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={position || { lat: 23.8103, lng: 90.4125 }}
          zoom={12}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapInitializer setMapInstance={setMapInstance} />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Helper text */}
      {position && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600">
            💡 Click anywhere on the map to update the location, or search for an address above
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
