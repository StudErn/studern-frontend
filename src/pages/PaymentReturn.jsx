import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const STATUS_CONFIG = {
  success: {
    icon: (
      <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Payment Successful!',
    message: 'Your job posting payment has been received. Your job will be published shortly.',
    badgeClass: 'bg-green-100 text-green-800',
    badgeText: 'Payment Confirmed',
  },
  failed: {
    icon: (
      <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again or contact support.',
    badgeClass: 'bg-red-100 text-red-800',
    badgeText: 'Payment Failed',
  },
  cancelled: {
    icon: (
      <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'Payment Cancelled',
    message: 'You cancelled the payment. Your job posting has not been published.',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    badgeText: 'Payment Cancelled',
  },
  error: {
    icon: (
      <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred while processing your payment. Please contact support.',
    badgeClass: 'bg-gray-100 text-gray-800',
    badgeText: 'Error',
  },
};

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(null);

  const status = searchParams.get('status') || 'error';
  const paymentId = searchParams.get('paymentId');
  const reason = searchParams.get('reason');

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.error;
  const isSuccess = status === 'success';

  // Auto-redirect to dashboard after success
  useEffect(() => {
    if (isSuccess) {
      setCountdown(5);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      window.location.href = '/dashboard/jobs';
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">{config.icon}</div>

        {/* Badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${config.badgeClass}`}>
          {config.badgeText}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h1>

        {/* Message */}
        <p className="text-gray-500 mb-6">{config.message}</p>

        {/* Reason (only on failure) */}
        {!isSuccess && reason && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-6 break-words">
            {decodeURIComponent(reason)}
          </p>
        )}

        {/* Payment reference */}
        {paymentId && (
          <p className="text-xs text-gray-400 mb-6">
            Payment reference: <span className="font-mono">{paymentId}</span>
          </p>
        )}

        {/* Auto-redirect countdown */}
        {isSuccess && countdown !== null && (
          <p className="text-sm text-gray-400 mb-4">
            Redirecting to your jobs in <span className="font-bold text-[#00B8D4]">{countdown}s</span>…
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard/jobs"
            className="px-6 py-2 bg-[#00B8D4] text-white rounded-lg font-medium hover:bg-[#0099b5] transition-colors"
          >
            View My Jobs
          </Link>
          {!isSuccess && (
            <Link
              to="/dashboard/jobs/create"
              className="px-6 py-2 border border-[#00B8D4] text-[#00B8D4] rounded-lg font-medium hover:bg-[#00B8D4] hover:text-white transition-colors"
            >
              Try Again
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
