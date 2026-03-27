'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = api.getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Specializations matching mobile app
  const serviceTypes = [
    {
      name: 'Dentistry',
      value: 'Dentistry',
      icon: '🦷',
      description: 'Dental and oral health care',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      name: 'Ophthalmology',
      value: 'Ophthalmology',
      icon: '👁️',
      description: 'Eye and vision care',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Optometry',
      value: 'Optometry',
      icon: '👓',
      description: 'Vision care and optical services',
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-50 to-teal-50'
    },
    {
      name: 'Plastic Surgery',
      value: 'Plastic Surgery',
      icon: '✨',
      description: 'Reconstructive and cosmetic surgery',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      name: 'Dermatology',
      value: 'Dermatology',
      icon: '🌟',
      description: 'Skin, hair, and nail care',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      name: 'General Practice',
      value: 'General Practice',
      icon: '🩺',
      description: 'Primary and family healthcare',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-[#EDF6F9]/30 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <a href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <img src="/logo.png" alt="OpenMed" className="h-14 w-auto relative" />
            </div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              OpenMed
            </span>
          </a>
          <nav className="flex gap-2">
            <a
              href="/providers"
              className="text-primary-600 hover:text-primary-700 px-6 py-2.5 rounded-lg hover:bg-primary-50 transition-all font-semibold text-lg"
            >
              See Providers
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-60"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-200/20 to-transparent rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            {/* Hero Text */}
            <div className="text-center mb-24">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  Healthcare Made Simple
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                Find Quality Healthcare
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600">
                  At The Right Price
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Compare prices and book appointments with verified medical providers across Ghana.
                Your health journey starts here.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                    100+
                  </div>
                  <div className="text-gray-600 font-semibold mt-2">Verified Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                    6
                  </div>
                  <div className="text-gray-600 font-semibold mt-2">Specializations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                    24/7
                  </div>
                  <div className="text-gray-600 font-semibold mt-2">Availability</div>
                </div>
              </div>
            </div>

            {/* Service Types */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  Browse by Specialty
                </h2>
                <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                  Find the right healthcare professional for your needs
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => router.push(`/providers?specialization=${type.value}`)}
                    className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-opacity-50 overflow-hidden"
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with gradient */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-4xl">{type.icon}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700">
                        {type.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700">
                        {type.description}
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                        <span className="text-sm font-semibold mr-2">Explore</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              Why Choose OpenMed?
            </h2>
            <p className="text-center text-gray-600 text-lg mb-20 max-w-2xl mx-auto">
              We make healthcare accessible, transparent, and convenient for everyone
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Compare Prices
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  See upfront pricing from multiple providers and choose what fits your budget
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Verified Providers
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  All providers are verified with proper licenses and credentials
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Easy Booking
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Book appointments instantly with real-time availability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section for Providers */}
        <div className="bg-secondary-600 py-24">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="text-6xl mb-8">👨‍⚕️</div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Are you a medical provider?
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Join OpenMed and reach more patients. Grow your practice with our platform.
            </p>
            <a
              href="/auth/register?role=provider"
              className="inline-block bg-primary-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-all"
            >
              Register as Provider
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-600 text-white/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.png" alt="OpenMed" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-white">OpenMed</span>
            </div>
            <p className="text-lg">Quality healthcare for all Ghanaians</p>
          </div>
          <div className="text-center text-sm">
            <p>© 2026 OpenMed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
