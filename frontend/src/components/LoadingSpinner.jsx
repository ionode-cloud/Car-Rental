import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading RideVista...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-primary/40 border-b-transparent animate-spin" />
      </div>
      {text && <p className="text-sm font-semibold tracking-wider text-gray-300 uppercase animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-brand-black/90 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
};

export default LoadingSpinner;
