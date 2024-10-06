import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="border border-gray-300 rounded p-4 mb-2 bg-white h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-gray-200 h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-white h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-gray-200 h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-white h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-gray-200 h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-white h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-gray-200 h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-white h-10"></div>
      <div className="border border-gray-300 rounded p-4 mb-2 bg-gray-200 h-10"></div>
    </div>
  );
};

export default SkeletonLoader;
