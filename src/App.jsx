import React, { useState, useEffect } from 'react';
import Alert from './components/Alert';
import  AddSchoolForm from './components/AddSchoolForm';
import SchoolSearch from './components/SchoolSearch';

const API_BASE_URL = 'http://localhost:3000';

const App = () => {
  const [alert, setAlert] = useState(null);
  const [searchRef, setSearchRef] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  const handleSchoolAdded = () => {
    if (searchRef && searchRef.refreshSchools) {
      setTimeout(() => searchRef.refreshSchools(), 500);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('✅ Connected to School Management API');
        }
      })
      .catch(() => {
        showAlert('error', '⚠️ Server not running. Please start the backend server first.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl text-white">🏫</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            School Management System
          </h1>
          <p className="text-gray-600 text-lg">
            Add schools and find the nearest ones to your location
          </p>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert {...alert} onClose={clearAlert} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <AddSchoolForm onSchoolAdded={handleSchoolAdded} onAlert={showAlert} />
          <SchoolSearch ref={setSearchRef} onAlert={showAlert} />
        </div>
      </div>
    </div>
  );
};

export default App;