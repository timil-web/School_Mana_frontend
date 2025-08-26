import React, { useEffect } from 'react';

const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800',
    error: 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800'
  };

  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`p-4 rounded-xl ${alertStyles[type]} animate-in slide-in-from-top duration-300`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 text-xl">
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert
