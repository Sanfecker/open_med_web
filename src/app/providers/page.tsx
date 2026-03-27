'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Provider } from '@/types';

// Provider Card Component
function ProviderCard({ provider }: { provider: Provider }) {
  const fullName = provider.firstName && provider.lastName
    ? `${provider.firstName} ${provider.lastName}`
    : 'Healthcare Provider';

  // Get specialization-specific gradient
  const specializationGradients: Record<string, string> = {
    'Dentistry': 'from-blue-500 to-cyan-500',
    'Ophthalmology': 'from-purple-500 to-pink-500',
    'Optometry': 'from-cyan-500 to-teal-500',
    'Plastic Surgery': 'from-pink-500 to-rose-500',
    'Dermatology': 'from-amber-500 to-orange-500',
    'General Practice': 'from-green-500 to-emerald-500',
  };

  const gradient = provider.specialization
    ? specializationGradients[provider.specialization] || 'from-gray-500 to-gray-600'
    : 'from-gray-500 to-gray-600';

  return (
    <a
      href={`/providers/${provider.id}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-transparent transform hover:-translate-y-1"
    >
      {/* Provider Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {provider.clinicImage ? (
          <img
            src={provider.clinicImage}
            alt={provider.clinicName || fullName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <div className="text-6xl text-white opacity-50">
              {provider.specialization?.charAt(0) || '🏥'}
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {provider.isVerified && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-gray-900">Verified</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Provider Name */}
        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-secondary-600 transition-all">
          {fullName}
        </h3>

        {/* Specialization Badge */}
        {provider.specialization && (
          <div className={`inline-block mb-4`}>
            <span className={`bg-gradient-to-r ${gradient} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md`}>
              {provider.specialization}
            </span>
          </div>
        )}

        {/* Clinic Details */}
        {provider.clinicName && (
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-gray-700 font-semibold">{provider.clinicName}</span>
          </div>
        )}

        {provider.location && (
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-600">{provider.location}</span>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-primary-600 font-bold group-hover:underline">View Details</span>
          <svg className="w-5 h-5 text-primary-600 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </a>
  );
}

function ProvidersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filter states
  const [specialization, setSpecialization] = useState(
    searchParams.get('specialization') || ''
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [isVerified, setIsVerified] = useState(
    searchParams.get('isVerified') === 'true'
  );

  useEffect(() => {
    // Check if user is authenticated
    const token = api.getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [searchParams]);

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);

    const filters: any = {};
    if (specialization) filters.specialization = specialization;
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (isVerified) filters.isVerified = true;

    const response = await api.searchProviders(filters);

    if (response.success && response.data) {
      setProviders(response.data.providers || []);
    } else {
      setError(response.error?.message || 'Failed to load providers');
    }

    setLoading(false);
  };

  const clearFilters = () => {
    setSpecialization('');
    setMaxPrice('');
    setIsVerified(false);
    router.push('/providers');
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (specialization) params.append('specialization', specialization);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (isVerified) params.append('isVerified', 'true');

    const queryString = params.toString();
    router.push(queryString ? `/providers?${queryString}` : '/providers');
  };

  // Specializations matching mobile app
  const specializations = [
    { value: 'Dentistry', label: 'Dentistry', icon: '🦷', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'Ophthalmology', label: 'Ophthalmology', icon: '👁️', gradient: 'from-purple-500 to-pink-500' },
    { value: 'Optometry', label: 'Optometry', icon: '👓', gradient: 'from-cyan-500 to-teal-500' },
    { value: 'Plastic Surgery', label: 'Plastic Surgery', icon: '✨', gradient: 'from-pink-500 to-rose-500' },
    { value: 'Dermatology', label: 'Dermatology', icon: '🌟', gradient: 'from-amber-500 to-orange-500' },
    { value: 'General Practice', label: 'General Practice', icon: '🩺', gradient: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#EDF6F9]/20 to-white">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            {specialization || 'All Healthcare Providers'}
          </h1>
          <p className="text-gray-600 text-xl">
            {loading ? 'Loading providers...' : `${providers.length} provider${providers.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                {(specialization || maxPrice || isVerified) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-bold hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Specialization - Colorful Buttons */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-4">
                  Specialization
                </label>
                <div className="space-y-2">
                  {specializations.map((spec) => (
                    <button
                      key={spec.value}
                      onClick={() => setSpecialization(specialization === spec.value ? '' : spec.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all transform hover:scale-105 ${
                        specialization === spec.value
                          ? `border-transparent bg-gradient-to-r ${spec.gradient} text-white shadow-lg`
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{spec.icon}</span>
                        <span>{spec.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Maximum Price (GHS)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any price"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-gray-900 transition-all"
                />
              </div>

              {/* Verified Only */}
              <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-600 mt-0.5"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-semibold text-gray-900 block">
                      Verified providers only
                    </span>
                    <span className="text-xs text-gray-600">
                      Licensed and credential-verified professionals
                    </span>
                  </div>
                </label>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={updateFilters}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error loading providers</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-20 bg-gray-100 rounded mt-4"></div>
                  </div>
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100">
                <div className="text-7xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No providers found
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any providers matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ProvidersContent />
    </Suspense>
  );
}
