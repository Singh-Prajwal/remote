"use client";
import { useEffect } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const OnlineStatusBanner = () => {
  const { isOnline, wasOffline, setWasOffline } = useNetworkStatus();

  useEffect(() => {
    if (wasOffline && isOnline) {
      const timer = setTimeout(() => {
        setWasOffline(false); // hide after delay
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline]);

  if (wasOffline && isOnline) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg animate-bounce">
        You’re back online!
      </div>
    );
  }

  return null;
};

export default OnlineStatusBanner;
