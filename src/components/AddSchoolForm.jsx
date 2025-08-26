import React from 'react'
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = import.meta.env.API_BASE_URL;

const AddSchoolForm = ({ onSchoolAdded, onAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onAlert('error', 'Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        onAlert('success', 'Location retrieved successfully! 📍');
        setIsGettingLocation(false);
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
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSubmit = async () => {
    
    if (!formData.name.trim() || !formData.address.trim() || !formData.latitude || !formData.longitude) {
      onAlert('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    const schoolData = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/addSchool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData)
      });

      const result = await response.json();

      if (result.success) {
        onAlert('success', 'School added successfully! 🎉');
        setFormData({ name: '', address: '', latitude: '', longitude: '' });
        onSchoolAdded();
      } else {
        onAlert('error', result.message || 'Failed to add school');
      }
    } catch (error) {
      onAlert('error', 'Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Add New School</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            School Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter school name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter complete address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="any"
              required
              placeholder="e.g., 40.7128"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="any"
              required
              placeholder="e.g., -74.0060"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Adding School...</span>
            </>
          ) : (
            <>
              <span className="mr-2">➕</span>
              Add School
            </>
          )}
        </button>

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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

      <p className="text-sm text-gray-500 mt-4 text-center">
        This will fill the coordinates with your current location
      </p>
    </div>
  );
};

export default AddSchoolForm
