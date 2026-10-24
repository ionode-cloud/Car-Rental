import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How To Choose The Right Car',
    date: 'March 14, 2026',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Selecting the perfect rental depends on passengers, terrain, luggage space, and fuel efficiency requirements.',
  },
  {
    id: 2,
    title: 'Which plan is right for me?',
    date: 'March 18, 2026',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Comparing daily, weekend getaway, and monthly executive subscription rental packages.',
  },
  {
    id: 3,
    title: 'Enjoy Speed, Silence & Total control',
    date: 'March 22, 2026',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop',
    excerpt: 'The sensation of driving high-performance electric vehicles and luxury German engineering.',
  },
];

const BRANDS = [
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Toyota_logo_%282020%29.svg' },
  { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
  { name: 'Jeep', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Jeep_logo.svg' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/contact', formData);
      if (response.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#151515] pb-12 w-full">
      {/* ==================== 1. FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-10 mb-12 rounded-none">
        <div className="container-fluid text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151515] font-heading">
            Contact Us
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            <Link to="/" className="hover:text-brand-primary">Home</Link> / Contact Us
          </p>
          <p className="text-sm font-semibold text-brand-primary mt-2">
            We are here to help you.
          </p>
        </div>
      </div>

      <div className="container-fluid">
        {/* ==================== 2. MAIN 2-COLUMN LAYOUT ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
          {/* Left Column: Purple Form Card */}
          <div className="lg:col-span-5 bg-brand-primary text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-white/80 mb-6">
                Fill in the details below and our concierge team will respond within minutes.
              </p>

              {submitted && (
                <div className="mb-4 p-3 bg-white/10 border border-white/30 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-300" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 text-xs"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 text-xs"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 text-xs"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject (e.g. Booking Enquiry)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 text-xs"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your Message..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 text-xs resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-100 text-brand-primary font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Large Image / Map */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-gray-100 shadow-xl relative min-h-[350px]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
              alt="Car Showroom / Contact Hub"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
              <div className="text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Concierge Support
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  Ready to assist you 24/7 on every road
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. CONTACT INFO STRIP ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-[#EAEAEA] mb-16">
          {/* Address */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777777] block">
                Address
              </span>
              <p className="text-xs font-bold text-[#151515]">Oxford Ave. Cary, NC 27511</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Mail className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777777] block">
                Email
              </span>
              <a href="mailto:support@carrental.com" className="text-xs font-bold text-[#151515] hover:text-brand-primary">
                support@carrental.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Phone className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777777] block">
                Phone
              </span>
              <a href="tel:+5375476401" className="text-xs font-bold text-[#151515] hover:text-brand-primary">
                +537 547-6401
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777777] block">
                Opening Hours
              </span>
              <p className="text-xs font-bold text-[#151515]">Sun - Mon 10am - 10pm</p>
            </div>
          </div>
        </div>

        {/* ==================== 4. LATEST BLOG POSTS & NEWS ==================== */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#151515] font-heading">
              Latest blog posts & news
            </h2>
            <p className="text-xs text-[#777777] mt-1">
              Automotive guides, rental tips, and road trip inspiration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-[#EAEAEA] bg-[#F8F8FA] overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2.5">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                    {post.date}
                  </span>
                  <h3 className="text-sm font-bold text-[#151515] group-hover:text-brand-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#777777] leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary group-hover:underline">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 5. FULL WIDTH BRAND LOGO STRIP ==================== */}
      <div className="w-full bg-[#F8F8FA] border-t border-[#EAEAEA] py-12 mt-16 rounded-none">
        <div className="container-fluid">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center p-2 grayscale hover:grayscale-0 transition-all hover:scale-105"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-10 w-auto object-contain max-w-[90px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-sm font-extrabold tracking-wider text-gray-800">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
