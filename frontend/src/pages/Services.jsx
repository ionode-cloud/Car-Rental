import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane,
  Car,
  Bike,
  Building2,
  HeartHandshake,
  Compass,
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.services) {
          setServices(response.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-20">
      {/* Header Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">
            Mobility Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Our Rental Services
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            From seamless airport terminal pickups to executive corporate fleets and bespoke
            wedding convoys, discover comprehensive automotive solutions designed around you.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-12">
            {services.map((svc, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={svc._id}
                  className="glass-panel rounded-3xl overflow-hidden border border-white/10 grid grid-cols-1 lg:grid-cols-12 items-center"
                >
                  {/* Image Column */}
                  <div
                    className={`lg:col-span-6 h-72 lg:h-96 overflow-hidden relative ${
                      isEven ? 'order-1' : 'order-1 lg:order-2'
                    }`}
                  >
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Content Column */}
                  <div
                    className={`lg:col-span-6 p-8 lg:p-12 space-y-5 ${
                      isEven ? 'order-2' : 'order-2 lg:order-1'
                    }`}
                  >
                    <div className="inline-block px-3.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase">
                      {svc.pricing}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {svc.title}
                    </h2>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {svc.description}
                    </p>

                    <div className="pt-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Key Inclusions & Highlights:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
                        {svc.features?.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                      <Link
                        to="/car-rental"
                        className="orange-gradient-btn px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2"
                      >
                        <span>Reserve Ride</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/contact-us"
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-colors"
                      >
                        Contact Concierge
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
