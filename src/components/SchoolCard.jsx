import React from 'react'


const SchoolCard = ({ school, index }) => (
  <div 
    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300" />
    
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
        {school.name}
      </h3>
      <span className="text-gray-400 group-hover:text-indigo-500 transition-colors text-xl">🏫</span>
    </div>
    
    <div className="flex items-start mb-3 text-gray-600">
      <span className="text-sm mt-1 mr-2">📍</span>
      <span className="text-sm leading-relaxed">{school.address}</span>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
        <span className="mr-1">🎯</span>
        {school.distance} km away
      </div>
      
      <div className="text-xs text-gray-500 font-mono">
        {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
      </div>
    </div>
  </div>
);

export default SchoolCard
