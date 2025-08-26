import React from 'react'


const Statistics = ({ schools }) => {
  if (!schools.length) return null;

  const nearestDistance = schools[0]?.distance || 0;
  const totalSchools = schools.length;

  return (
	<div className="grid grid-cols-2 gap-4 mb-6">
	  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl">
		<div className="flex items-center justify-between">
		  <div>
			<div className="text-2xl font-bold">{totalSchools}</div>
			<div className="text-sm opacity-90">Total Schools</div>
		  </div>
		  <span className="text-2xl opacity-80">👥</span>
		</div>
	  </div>
	  
	  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-xl">
		<div className="flex items-center justify-between">
		  <div>
			<div className="text-2xl font-bold">{nearestDistance} km</div>
			<div className="text-sm opacity-90">Nearest</div>
		  </div>
		  <span className="text-2xl opacity-80">🎯</span>
		</div>
	  </div>
	</div>
  );
};
export default Statistics
