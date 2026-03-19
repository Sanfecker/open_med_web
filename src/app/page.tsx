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

  const serviceTypes = [
    {
      name: 'General Practitioners',
      value: 'doctor',
      icon: '🩺',
      description: 'Primary care physicians for general health concerns',
      color: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400'
    },
    {
      name: 'Dentists',
      value: 'dentist',
      icon: '🦷',
      description: 'Oral health care and dental treatments',
      color: 'from-cyan-50 to-cyan-100 border-cyan-200 hover:border-cyan-400'
    },
    {
      name: 'Optometrists',
      value: 'optometrist',
      icon: '👓',
      description: 'Eye care specialists and vision correction',
      color: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400'
    },
    {
      name: 'Physiotherapists',
      value: 'physiotherapist',
      icon: '💪',
      description: 'Physical therapy and rehabilitation services',
      color: 'from-green-50 to-green-100 border-green-200 hover:border-green-400'
    },
    {
      name: 'Psychologists',
      value: 'psychologist',
      icon: '🧠',
      description: 'Mental health support and counseling',
      color: 'from-pink-50 to-pink-100 border-pink-200 hover:border-pink-400'
    },
    {
      name: 'Dermatologists',
      value: 'dermatologist',
      icon: '✨',
      description: 'Skin care specialists and treatments',
      color: 'from-amber-50 to-amber-100 border-amber-200 hover:border-amber-400'
    },
    {
      name: 'Pediatricians',
      value: 'pediatrician',
      icon: '👶',
      description: 'Specialized care for infants and children',
      color: 'from-rose-50 to-rose-100 border-rose-200 hover:border-rose-400'
    },
    {
      name: 'Other Specialists',
      value: 'other',
      icon: '➕',
      description: 'Additional medical professionals and services',
      color: 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              O
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              OpenMed
            </span>
          </div>
          <nav className="flex gap-3">
            {!isAuthenticated && (
              <>
                <a
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-medium"
                >
                  Sign In
                </a>
                <a
                  href="/auth/register"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Sign Up
                </a>
              </>
            )}
            {isAuthenticated && (
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                Dashboard
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="bg-gradient-to-br from-red-50 via-amber-50 to-green-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Quality Healthcare
                <br />
                <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  At The Right Price
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
                Compare prices and book appointments with verified medical providers across Ghana
              </p>
            </div>

            {/* View All Providers - Prominent CTA */}
            <div className="max-w-2xl mx-auto mb-16">
              <button
                onClick={() => router.push('/providers')}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-6 rounded-2xl hover:from-red-700 hover:to-red-800 font-semibold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
              >
                <span>View All Providers</span>
                <svg
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Service Types */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Browse by Specialty
                </h2>
                <p className="text-gray-600 text-lg">
                  Find the right healthcare professional for your needs
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {serviceTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => router.push(`/providers?providerType=${type.value}`)}
                    className={`bg-gradient-to-br ${type.color} border-2 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-left group`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                        {type.icon}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 group-hover:text-gray-600 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Why Choose OpenMed?
            </h2>
            <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
              We make healthcare accessible, transparent, and convenient for everyone
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Compare Prices
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  See upfront pricing from multiple providers and choose what fits your budget
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Verified Providers
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  All providers are verified with proper licenses and credentials
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
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
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="text-6xl mb-6">👨‍⚕️</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Are you a medical provider?
            </h2>
            <p className="text-xl text-red-100 mb-10 leading-relaxed">
              Join OpenMed and reach more patients. Grow your practice with our platform.
            </p>
            <a
              href="/auth/register?role=provider"
              className="inline-block bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Register as Provider
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
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
