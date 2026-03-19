'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const PROVIDER_TYPES = [
  { value: 'doctor', label: 'Doctor', icon: '🩺', description: 'General Practitioner' },
  { value: 'dentist', label: 'Dentist', icon: '🦷', description: 'Dental Care' },
  { value: 'optometrist', label: 'Optometrist', icon: '👓', description: 'Eye Care' },
  { value: 'physiotherapist', label: 'Physiotherapist', icon: '💪', description: 'Physical Therapy' },
  { value: 'psychologist', label: 'Psychologist', icon: '🧠', description: 'Mental Health' },
  { value: 'dermatologist', label: 'Dermatologist', icon: '✨', description: 'Skin Care' },
  { value: 'pediatrician', label: 'Pediatrician', icon: '👶', description: 'Child Care' },
  { value: 'other', label: 'Other', icon: '➕', description: 'Other Medical Field' },
];

interface ServiceItem {
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    providerType: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
  });

  const [services, setServices] = useState<ServiceItem[]>([
    { name: '', description: '', price: '', currency: 'GHS', duration: '30' }
  ]);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError('Please fill in all fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.providerType || !formData.specialization || !formData.licenseNumber) {
        setError('Please fill in all fields');
        return;
      }
    } else if (step === 3) {
      if (!formData.yearsOfExperience) {
        setError('Please enter your years of experience');
        return;
      }
      const years = parseInt(formData.yearsOfExperience);
      if (isNaN(years) || years < 0) {
        setError('Please enter a valid number');
        return;
      }
    } else if (step === 4) {
      // Validate services
      const hasValidService = services.some(s => s.name && s.price && s.duration);
      if (!hasValidService) {
        setError('Please add at least one service with name, price, and duration');
        return;
      }
    }

    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const addService = () => {
    setServices([...services, { name: '', description: '', price: '', currency: 'GHS', duration: '30' }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, update provider profile
      const profileResponse = await api.updateProviderProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        providerType: formData.providerType,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
      });

      if (!profileResponse.success) {
        throw new Error(profileResponse.error?.message || 'Failed to update profile');
      }

      // Then, add services (only valid ones)
      const validServices = services.filter(s => s.name && s.price && s.duration);

      for (const service of validServices) {
        const serviceResponse = await api.addService({
          name: service.name,
          description: service.description,
          price: parseFloat(service.price),
          currency: service.currency,
          duration: parseInt(service.duration),
        });

        if (!serviceResponse.success) {
          console.error('Failed to add service:', service.name);
        }
      }

      // Navigate to success page
      router.push('/auth/onboarding/success');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="OpenMed" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-secondary-600">OpenMed</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's get you set up!</h1>
          <p className="text-gray-600">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 transition-all"
                    placeholder="+233 XXX XXX XXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    What type of provider are you?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROVIDER_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, providerType: type.value })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.providerType === type.value
                            ? 'border-primary-600 bg-primary-600/10'
                            : 'border-gray-200 hover:border-primary-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-600">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 transition-all"
                    placeholder="e.g., General Practice, Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 transition-all"
                    placeholder="Your professional license number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Experience</h2>
                <p className="text-gray-600">This helps patients know your level of expertise</p>
              </div>

              <div className="max-w-sm mx-auto">
                <label className="block text-sm font-medium text-gray-900 mb-2 text-center">
                  How many years of experience do you have?
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-center text-lg transition-all"
                  placeholder="0"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Enter 0 if you're just starting out
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Services & Pricing */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">💰</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Services & Pricing</h2>
                    <p className="text-gray-600">Price transparency is what sets OpenMed apart!</p>
                  </div>
                </div>
                <div className="bg-primary-600/10 border border-primary-600/30 rounded-lg p-4">
                  <p className="text-sm text-gray-900">
                    <strong>Why this matters:</strong> Patients can see your prices upfront, making healthcare more accessible and transparent.
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {services.map((service, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 hover:border-primary-600 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">Service {index + 1}</h3>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-sm"
                          placeholder="e.g., General Consultation"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-sm"
                          placeholder="Brief description of the service"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Price *
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={service.currency}
                              onChange={(e) => updateService(index, 'currency', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-sm"
                            >
                              <option value="GHS">GHS</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Duration *
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="5"
                              step="5"
                              value={service.duration}
                              onChange={(e) => updateService(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 text-sm"
                              placeholder="30"
                            />
                            <span className="text-xs text-gray-600">min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addService}
                className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-600 hover:text-primary-600 font-medium transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Service
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 font-semibold transition-all"
              >
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Setting up...' : 'Complete Setup 🎉'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
