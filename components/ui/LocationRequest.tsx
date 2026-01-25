// ============================================
// VIBE & VALUE - Location Request UI
// Prompts users to enable location services
// ============================================

"use client";

import { useLocation } from "@/components/providers/LocationProvider";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

export function LocationRequest({
  onLocationGranted,
  onDismiss,
}: {
  onLocationGranted?: () => void;
  onDismiss?: () => void;
}) {
  const { location, requestLocation } = useLocation();

  // Don't show if permission already granted
  if (location.permission === "granted" || location.loading) {
    return null;
  }

  // Don't show if explicitly dismissed
  if (location.permission === "denied") {
    return null;
  }

  const handleRequest = async () => {
    await requestLocation();
    if (location.permission === "granted") {
      onLocationGranted?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-vibrant-orange-100 rounded-full flex items-center justify-center">
            <MapPinIcon className="w-8 h-8 text-vibrant-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-display font-bold text-center text-editorial-black mb-2">
          Enable Your Location
        </h3>

        {/* Description */}
        <p className="text-center text-editorial-gray mb-6">
          Allow Vibe & Value to access your location for:
        </p>

        {/* Benefits list */}
        <ul className="space-y-2 mb-6 text-sm text-editorial-gray">
          <li className="flex items-start gap-2">
            <span className="text-vibrant-orange-500">✓</span>
            <span>Find nearby grocery stores with your ingredients</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-orange-500">✓</span>
            <span>Get accurate distance calculations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-orange-500">✓</span>
            <span>Show store availability and pricing</span>
          </li>
        </ul>

        {/* Error message */}
        {location.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{location.error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onDismiss}
          >
            Maybe Later
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleRequest}
            loading={location.loading}
          >
            Allow Location
          </Button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Your location is only used to find nearby stores and is never shared.
        </p>
      </div>
    </div>
  );
}

// Slide up animation for mobile
<style jsx>{`
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
`}</style>
