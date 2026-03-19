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

  const providerTypeLabel = provider.providerType
    ? provider.providerType.charAt(0).toUpperCase() + provider.providerType.slice(1)
    : '';

  return (
    <a
      href={`/providers/${provider.id}`}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 p-8 block border-2 border-gray-100 hover:border-primary-600/30 overflow-hidden"
    >
      {/* Gradient background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-600/10 to-primary-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Header with name and verified badge */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {fullName}
            </h3>
            {providerTypeLabel && (
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                {providerTypeLabel}
              </p>
            )}
          </div>
          {provider.isVerified && (
            <div className="flex-shrink-0">
              <div className="bg-blue-500 text-white p-2 rounded-full shadow-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {provider.specialization && (
          <p className="text-sm text-gray-600 font-medium mt-2">
            {provider.specialization}
          </p>
        )}
      </div>

      {/* Rating and Experience */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-xl border border-amber-200">
          <svg className="w-5 h-5 text-amber-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-bold text-gray-900 text-lg">
            {provider.rating ? provider.rating.toFixed(1) : '0.0'}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            ({provider.totalReviews || 0})
          </span>
        </div>

        {provider.yearsOfExperience !== undefined && (
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <svg className="w-4 h-4 text-gray-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {provider.yearsOfExperience} {provider.yearsOfExperience === 1 ? 'year' : 'years'}
            </span>
          </div>
        )}
      </div>

      {provider.bio && (
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {provider.bio}
        </p>
      )}
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
  const [providerType, setProviderType] = useState(
    searchParams.get('providerType') || ''
  );
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
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
    if (providerType) filters.providerType = providerType;
    if (minRating) filters.minRating = parseFloat(minRating);
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
    setProviderType('');
    setMinRating('');
    setMaxPrice('');
    setIsVerified(false);
    router.push('/providers');
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (providerType) params.append('providerType', providerType);
    if (minRating) params.append('minRating', minRating);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (isVerified) params.append('isVerified', 'true');

    const queryString = params.toString();
    router.push(queryString ? `/providers?${queryString}` : '/providers');
  };

  const providerTypes = [
    { value: 'doctor', label: 'Doctors', icon: '🩺' },
    { value: 'dentist', label: 'Dentists', icon: '🦷' },
    { value: 'optometrist', label: 'Optometrists', icon: '👓' },
    { value: 'physiotherapist', label: 'Physiotherapists', icon: '💪' },
    { value: 'psychologist', label: 'Psychologists', icon: '🧠' },
    { value: 'dermatologist', label: 'Dermatologists', icon: '✨' },
    { value: 'pediatrician', label: 'Pediatricians', icon: '👶' },
    { value: 'other', label: 'Other', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="OpenMed" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-secondary-600">
              OpenMed
            </span>
          </a>
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
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up
                </a>
              </>
            )}
            {isAuthenticated && (
              <a
                href="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
              >
                Dashboard
              </a>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {providerType
              ? `${providerTypes.find(t => t.value === providerType)?.label || 'Providers'}`
              : 'All Healthcare Providers'}
          </h1>
          <p className="text-gray-600 text-lg">
            {loading ? 'Loading providers...' : `${providers.length} provider${providers.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {(providerType || minRating || maxPrice || isVerified) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Provider Type - Chip Buttons */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Provider Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {providerTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setProviderType(providerType === type.value ? '' : type.value)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        providerType === type.value
                          ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-xs">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {['4.5', '4.0', '3.5', '3.0'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? '' : rating)}
                      className={`w-full px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        minRating === rating
                          ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span>{rating}+ Stars</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
