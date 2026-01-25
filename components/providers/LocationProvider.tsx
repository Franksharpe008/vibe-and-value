// ============================================
// VIBE & VALUE - Location Provider
// Real-time geolocation with permission requests
// ============================================

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
  permission: "granted" | "denied" | "prompt" | "unknown";
}

interface LocationContextType {
  location: LocationData;
  requestLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    loading: false,
    permission: "unknown",
  });

  // Check current permission status on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setLocation((prev) => ({
            ...prev,
            permission: result.state === "granted" ? "granted" : result.state === "denied" ? "denied" : "prompt",
          }));
        })
        .catch(() => {
          setLocation((prev) => ({ ...prev, permission: "unknown" }));
        });
    }
  }, []);

  // Watch position changes if permission is granted
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
      }));
      return;
    }

    if (location.permission === "granted") {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            error: null,
            loading: false,
            permission: "granted",
          });
        },
        (error) => {
          setLocation((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
          }));
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [location.permission]);

  const requestLocation = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        loading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Request permission
      if ("permissions" in navigator) {
        const permissionResult = await navigator.permissions.query({ name: "geolocation" as PermissionName });

        if (permissionResult.state === "denied") {
          setLocation((prev) => ({
            ...prev,
            permission: "denied",
            loading: false,
            error: "Location permission denied. Please enable it in your browser settings.",
          }));
          return;
        }
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            error: null,
            loading: false,
            permission: "granted",
          });
        },
        (error) => {
          setLocation((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
            permission: "denied",
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      setLocation((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to get location",
        loading: false,
      }));
    }
  };

  const refreshLocation = async () => {
    await requestLocation();
  };

  return (
    <LocationContext.Provider value={{ location, requestLocation, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
