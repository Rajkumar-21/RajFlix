
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-12 h-12 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
