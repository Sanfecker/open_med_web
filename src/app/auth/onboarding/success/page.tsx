'use client';

import { useEffect, useState } from 'react';

export default function OnboardingSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-12 text-center transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Success Icon */}
          <div className="mb-8 animate-bounce-slow">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to OpenMed, Doctor!
          </p>

          {/* Approval Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Pending Approval
                </h3>
                <p className="text-blue-700 text-sm">
                  Your account is currently under review. Our team will verify your credentials and approve your account within 24-48 hours. You'll receive an email notification once approved.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="space-y-4 text-left">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <div>
                  <p className="text-gray-700">
                    <strong>Wait for approval:</strong> We'll review your credentials and notify you via email.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <div>
                  <p className="text-gray-700">
                    <strong>Download the mobile app:</strong> Once approved, use the OpenMed Provider mobile app to manage your practice.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <div>
                  <p className="text-gray-700">
                    <strong>Start accepting patients:</strong> Add your services, set your availability, and begin receiving bookings!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white mb-8">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold mb-3">
              OpenMed Provider App
            </h3>
            <p className="text-red-100 mb-6">
              Manage your practice on the go with our mobile app
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold">iOS</div>
                <div className="text-red-100 text-xs">Run with Flutter</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-semibold">Android</div>
                <div className="text-red-100 text-xs">Run with Flutter</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">💻</div>
                <div className="font-semibold">Windows</div>
                <div className="text-red-100 text-xs">Run with Flutter</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <a
            href="/"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
