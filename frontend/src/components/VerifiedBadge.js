import React from 'react';

const VerifiedBadge = ({ status, size = 'sm' }) => {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full ${
          size === 'sm'
            ? 'text-xs px-2 py-0.5'
            : size === 'md'
            ? 'text-sm px-2.5 py-1'
            : 'text-sm px-3 py-1.5'
        } bg-green-50 text-green-700 border border-green-200`}
        title="This shop has been verified by Near By Store"
      >
        <svg
          className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Verified
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full ${
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
        } bg-yellow-50 text-yellow-700 border border-yellow-200`}
      >
        ⏳ Pending Review
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full ${
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
        } bg-red-50 text-red-600 border border-red-200`}
      >
        ❌ Rejected
      </span>
    );
  }

  // Unverified
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      } bg-gray-50 text-gray-500 border border-gray-200`}
    >
      Unverified
    </span>
  );
};

export default VerifiedBadge;