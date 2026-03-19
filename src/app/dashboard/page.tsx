'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Booking } from '@/types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!api.getToken()) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    const response = await api.getMyBookings();

    if (response.success && response.data) {
      try {
        console.log('Dashboard: Response data type:', typeof response.data);
        console.log('Dashboard: Response data:', response.data);

        // Handle both { bookings: [] } and direct array responses
        let bookingsData: any[] = [];

        if (Array.isArray(response.data)) {
          bookingsData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          bookingsData = response.data.bookings || [];
        }

        console.log('Dashboard: Found', bookingsData.length, 'bookings');
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error parsing bookings:', err);
        setError(`Failed to parse bookings: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      console.log('Dashboard: Error response:', response.error);
      // Check if error indicates this is a provider account
      if (response.error?.code === 'FORBIDDEN' || response.error?.message?.includes('provider')) {
        setIsProvider(true);
      } else {
        setError(response.error?.message || 'Failed to load bookings');
      }
    }

    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);

    const response = await api.cancelBooking(bookingId, 'Cancelled by user');

    if (response.success) {
      // Refresh bookings
      await fetchBookings();
    } else {
      alert(response.error?.message || 'Failed to cancel booking');
    }

    setCancellingId(null);
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="OpenMed" className="h-10 w-auto" />
              <span className="text-xl font-semibold text-secondary-600">OpenMed</span>
            </a>
            <nav className="flex gap-4 items-center">
              <a href="/providers" className="text-gray-600 hover:text-gray-900">
                Find Providers
              </a>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and bookings</p>
        </div>

        {isProvider ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">📱</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Provider Dashboard
            </h2>
            <p className="text-gray-900 mb-8 max-w-2xl mx-auto">
              Welcome! As a medical provider, please use the <strong>OpenMed Mobile App</strong> to manage your practice, view bookings, and update your schedule.
            </p>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto mb-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Download the Mobile App:</h3>
              <ul className="text-left space-y-3 text-gray-900">
                <li>📱 <strong>iOS:</strong> Run with Flutter on iPhone/iPad</li>
                <li>🤖 <strong>Android:</strong> Run with Flutter on Android devices</li>
                <li>💻 <strong>Windows:</strong> Run with Flutter on Windows</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              The web app is designed for patients to search and book appointments.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Appointments
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-16 text-center border border-gray-200">
                  <div className="text-6xl mb-6">📅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Book an appointment with a provider to get started
                  </p>
                  <a
                    href="/providers"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Find Providers
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Provider ID: {booking.providerId.slice(0, 8)}...
                          </h3>
                          <p className="text-sm text-gray-600">
                            Service ID: {booking.serviceId.slice(0, 8)}...
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">📅</span>
                          {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">🕐</span>
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">💰</span>
                          {booking.currency} {booking.price}
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Past Appointments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm p-6 opacity-75 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Provider ID: {booking.providerId.slice(0, 8)}...
                          </h3>
                          <p className="text-sm text-gray-600">
                            Service ID: {booking.serviceId.slice(0, 8)}...
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">📅</span>
                          {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">🕐</span>
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center text-gray-900">
                          <span className="font-medium mr-2">💰</span>
                          {booking.currency} {booking.price}
                        </div>
                      </div>

                      {booking.cancellationReason && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Reason:</span>{' '}
                            {booking.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
