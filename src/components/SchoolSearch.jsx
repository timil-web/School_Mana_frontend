import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';
import SchoolCard from './SchoolCard';
import Statistics from './Statistics';

const API_BASE_URL = 'http://localhost:3000';


const SchoolSearch = ({ onAlert }) => {
  const [userLocation, setUserLocation] = useState({ latitude: '', longitude: '' });
  const [schools, setSchools] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setUserLocation(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onAlert('error', 'Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        });
        setIsGettingLocation(false);
        // Auto-search after getting location
        setTimeout(() => searchSchools(position.coords.latitude, position.coords.longitude), 100);
      },
      (error) => {
        let errorMsg = 'Failed to get location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out.';
            break;
          default:
            errorMsg += 'Unknown error occurred.';
        }
        onAlert('error', errorMsg);
        setIsGettingLocation(false);
      }
    );
  };

  const searchSchools = async (lat = null, lng = null) => {
    const latitude = lat || parseFloat(userLocation.latitude);
    const longitude = lng || parseFloat(userLocation.longitude);

    if (!latitude || !longitude) {
      onAlert('error', 'Please enter your latitude and longitude');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      onAlert('error', 'Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`${API_BASE_URL}/listSchools?latitude=${latitude}&longitude=${longitude}`);
      const result = await response.json();

      if (result.success) {
        setSchools(result.data);
        if (result.data.length === 0) {
          onAlert('info', 'No schools found. Add some schools first!');
        }
      } else {
        onAlert('error', result.message || 'Failed to fetch schools');
        setSchools([]);
      }
    } catch (error) {
      onAlert('error', 'Network error. Please check if the server is running.');
      setSchools([]);
    } finally {
      setIsSearching(false);
    }
  };

  
  const refreshSchools = () => {
    if (userLocation.latitude && userLocation.longitude) {
      searchSchools();
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Find Schools Near You</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-200">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Your Location:
        </label>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            name="latitude"
            value={userLocation.latitude}
            onChange={handleLocationChange}
            step="any"
            placeholder="Your Latitude"
            className="px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            name="longitude"
            value={userLocation.longitude}
            onChange={handleLocationChange}
            step="any"
            placeholder="Your Longitude"
            className="px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => searchSchools()}
            disabled={isSearching}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isSearching ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Searching...</span>
              </>
            ) : (
              <>
                <span className="mr-2">🔍</span>
                Search
              </>
            )}
          </button>

          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isGettingLocation ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Getting Location...</span>
              </>
            ) : (
              <>
                <span className="mr-2">🧭</span>
                Use My Location
              </>
            )}
          </button>
        </div>
      </div>

      <Statistics schools={schools} />

      <div className="max-h-96 overflow-y-auto pr-2">
        {isSearching ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="large" />
            <span className="ml-3 text-gray-600">Searching for schools...</span>
          </div>
        ) : schools.length > 0 ? (
          <div className="space-y-4">
            {schools.map((school, index) => (
              <SchoolCard key={school.id} school={school} index={index} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-16">
            <span className="text-6xl text-gray-300 block mb-4">🏫</span>
            <p className="text-gray-500 text-lg">No schools found</p>
            <p className="text-gray-400 text-sm mt-2">Add some schools first!</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl text-gray-300 block mb-4">📍</span>
            <p className="text-gray-500 text-lg">Enter your location to find nearby schools</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolSearch
