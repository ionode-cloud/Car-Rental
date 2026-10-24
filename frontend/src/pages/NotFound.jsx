import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md w-full glass-panel p-10 rounded-3xl border border-white/10 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-primary/20 text-brand-primary flex items-center justify-center mx-auto">
          <Car className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-brand-primary tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-white">Route Not Found</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          The road you are looking for has taken a detour or does not exist. Let's get you back on
          the highway.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="orange-gradient-btn px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/car-rental"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            Explore Fleet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
