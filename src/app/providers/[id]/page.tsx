'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Provider, Service, TimeSlot } from '@/types';
import { format, addDays, isSameDay, startOfDay, getDay } from 'date-fns';

// Calendar Day Component
function CalendarDay({
  date,
  isSelected,
  isToday,
  onClick,
  hasSlots
}: {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
  hasSlots?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-xl text-center transition-all duration-200
        ${isSelected
          ? 'bg-primary-600 text-white shadow-md'
          : isToday
          ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 text-gray-900'
          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600/40'
        }
      `}
    >
      <div className="text-xs font-semibold mb-1 uppercase">
        {format(date, 'EEE')}
      </div>
      <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
        {format(date, 'd')}
      </div>
      <div className="text-xs mt-1">
        {format(date, 'MMM')}
      </div>
      {hasSlots && !isSelected && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </button>
  );
}

// Success Modal Component
function SuccessModal({
  booking,
  provider,
  service,
  onClose
}: {
  booking: { date: string; startTime: string; endTime: string };
  provider: Provider;
  service: Service;
  onClose: () => void;
}) {
  const handleAddToCalendar = () => {
    // Create .ics file content
    const startDateTime = new Date(`${booking.date}T${booking.startTime}`);
    const endDateTime = new Date(`${booking.date}T${booking.endTime}`);

    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OpenMed//Appointment//EN
BEGIN:VEVENT
UID:${Date.now()}@openmed.com
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDateTime)}
DTEND:${formatDateForICS(endDateTime)}
SUMMARY:${service.name} with ${provider.firstName || ''} ${provider.lastName || 'Provider'}
DESCRIPTION:Appointment for ${service.name}
LOCATION:OpenMed
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `openmed-appointment-${booking.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 transform animate-[bounce_0.5s_ease-in-out]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-[pulse_2s_ease-in-out_infinite]">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h2>

          <p className="text-gray-600 mb-6 text-lg">
            Your appointment has been successfully booked
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🩺</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Service</div>
                  <div className="font-semibold text-gray-900">{service.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Date & Time</div>
                  <div className="font-semibold text-gray-900">
                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')} at {booking.startTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👨‍⚕️</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Provider</div>
                  <div className="font-semibold text-gray-900">
                    {provider.firstName || ''} {provider.lastName || 'Healthcare Provider'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCalendar}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-medium transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [hasAvailability, setHasAvailability] = useState(true);

  // Generate next 30 days for calendar
  const calendarDays = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchProviderData = async () => {
    setLoading(true);
    setError(null);

    const [providerRes, servicesRes, availabilityRes] = await Promise.all([
      api.getProvider(providerId),
      api.getProviderServices(providerId),
      api.getProviderAvailability(providerId),
    ]);

    if (providerRes.success && providerRes.data) {
      setProvider(providerRes.data.provider);
    } else {
      setError('Failed to load provider details');
    }

    if (servicesRes.success && servicesRes.data) {
      setServices(servicesRes.data.services || []);
    }

    // Check if provider has any availability set
    if (availabilityRes.success && availabilityRes.data) {
      setHasAvailability(availabilityRes.data.availability && availabilityRes.data.availability.length > 0);
    } else {
      setHasAvailability(false);
    }

    setLoading(false);
  };

  const fetchTimeSlots = async () => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const response = await api.getAvailability(providerId, dateString);

    if (response.success && response.data) {
      setTimeSlots(response.data.slots || []);
    } else {
      setTimeSlots([]);
    }

    setLoadingSlots(false);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      return;
    }

    // Check if user is logged in
    if (!api.getToken()) {
      router.push(`/auth/login?redirect=/providers/${providerId}`);
      return;
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const response = await api.createBooking({
      providerId,
      serviceId: selectedService.id,
      date: dateString,
      startTime: selectedTimeSlot.startTime,
      notes: bookingNotes,
    });

    if (response.success) {
      setBookingData({
        date: dateString,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
      });
      setShowSuccessModal(true);
    } else {
      alert(response.error?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_ease-in-out_infinite]">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <div className="text-7xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Provider Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">{error || 'This provider does not exist'}</p>
          <a
            href="/providers"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
          >
            ← Back to Providers
          </a>
        </div>
      </div>
    );
  }

  const fullName = provider.firstName && provider.lastName
    ? `${provider.firstName} ${provider.lastName}`
    : 'Healthcare Provider';

  const providerTypeLabel = provider.providerType
    ? provider.providerType.charAt(0).toUpperCase() + provider.providerType.slice(1)
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Success Modal */}
      {showSuccessModal && bookingData && selectedService && (
        <SuccessModal
          booking={bookingData}
          provider={provider}
          service={selectedService}
          onClose={() => router.push('/dashboard')}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="OpenMed" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-secondary-600">
              OpenMed
            </span>
          </a>
          <a
            href="/providers"
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Providers
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Provider Info & Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {fullName}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    {providerTypeLabel && (
                      <span className="text-lg font-semibold text-primary-600 uppercase tracking-wide">
                        {providerTypeLabel}
                      </span>
                    )}
                    {provider.isVerified && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                  {provider.specialization && (
                    <p className="text-xl text-gray-600 font-medium">{provider.specialization}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3 rounded-xl border border-amber-200">
                  <svg className="w-6 h-6 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-gray-900 text-2xl">
                    {provider.rating ? provider.rating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({provider.totalReviews || 0} reviews)
                  </span>
                </div>

                {provider.yearsOfExperience !== undefined && (
                  <div className="flex items-center bg-gray-50 px-5 py-3 rounded-xl border border-gray-200">
                    <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-gray-900">
                      {provider.yearsOfExperience} {provider.yearsOfExperience === 1 ? 'year' : 'years'} experience
                    </span>
                  </div>
                )}
              </div>

              {provider.bio && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
                </div>
              )}

              {provider.licenseNumber && (
                <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">License Number:</span>
                  <span className="ml-3 font-mono text-gray-900 font-semibold">
                    {provider.licenseNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Services Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Services Offered
              </h2>

              {services.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 text-lg">No services available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left border-2 rounded-xl p-6 transition-all duration-200 ${
                        selectedService?.id === service.id
                          ? 'border-primary-600 bg-primary-600/10 shadow-md'
                          : 'border-gray-200 hover:border-primary-600/40 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            {selectedService?.id === service.id && (
                              <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-gray-600 mb-3">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-3xl font-bold text-primary-600">
                            {service.currency} {service.price}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Appointment
              </h2>

              {/* Selected Service Display */}
              {selectedService && (
                <div className="mb-6 bg-primary-600/10 border-2 border-primary-600 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Selected Service</div>
                  <div className="font-bold text-gray-900 mb-1">{selectedService.name}</div>
                  <div className="text-xl font-bold text-primary-600">
                    {selectedService.currency} {selectedService.price}
                  </div>
                </div>
              )}

              {!hasAvailability ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 text-lg font-medium mb-2">No Time Slots Available</p>
                  <p className="text-gray-500 text-sm">
                    This provider hasn't set up their schedule yet. Please check back later.
                  </p>
                </div>
              ) : (
                <>
                  {/* Calendar */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Select a Date
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
                      {calendarDays.map((date) => {
                        const isToday = isSameDay(date, new Date());
                        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

                        return (
                          <CalendarDay
                            key={date.toISOString()}
                            date={date}
                            isSelected={isSelected}
                            isToday={isToday}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTimeSlot(null);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Available Time Slots
                      </label>
                      {loadingSlots ? (
                        <div className="text-center py-8">
                          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                      ) : timeSlots.filter(slot => !slot.isBooked).length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <p className="text-gray-600">No available slots for this date</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                          {timeSlots
                            .filter((slot) => !slot.isBooked)
                            .map((slot, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                                  selectedTimeSlot?.startTime === slot.startTime
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-600/40'
                                }`}
                              >
                                {slot.startTime}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Any specific concerns or requests..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-gray-900 transition-all"
                    />
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedService || !selectedDate || !selectedTimeSlot}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {!selectedService
                      ? 'Select a Service'
                      : !selectedDate
                      ? 'Select a Date'
                      : !selectedTimeSlot
                      ? 'Select a Time'
                      : 'Confirm Booking'}
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    You'll receive a confirmation after booking
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
