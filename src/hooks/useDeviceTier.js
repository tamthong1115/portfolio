import { useState, useEffect } from 'react';

/**
 * Evaluates device capability tier: "low" | "mid" | "high"
 * Based on:
 * - navigator.hardwareConcurrency (CPU cores)
 * - navigator.deviceMemory (RAM in GB, feature-detected)
 * - Viewport width / form factor
 * - URL parameter override for manual testing (?tier=low|mid|high)
 */
export function getDeviceTier() {
  if (typeof window === 'undefined') return 'high';

  // Allow URL override for manual testing and verification (?tier=low|mid|high)
  try {
    const params = new URLSearchParams(window.location.search);
    const tierOverride = params.get('tier');
    if (tierOverride === 'low' || tierOverride === 'mid' || tierOverride === 'high') {
      return tierOverride;
    }
  } catch {
    // Ignore URL parse error
  }

  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;

  const memory =
    typeof navigator !== 'undefined' && 'deviceMemory' in navigator
      ? navigator.deviceMemory
      : null; // null if unsupported (e.g. Safari, Firefox)

  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = width < 768;

  // Low Tier:
  // - RAM <= 2GB (if reported)
  // - CPU cores <= 2
  // - Mobile device with <= 4 cores and <= 4GB RAM
  if (
    (memory !== null && memory <= 2) ||
    cores <= 2 ||
    (isMobile && cores <= 4 && (memory === null || memory <= 4))
  ) {
    return 'low';
  }

  // Mid Tier:
  // - RAM <= 4GB
  // - CPU cores between 4 and 6
  // - Mobile viewport (< 768px) with moderate hardware
  if ((memory !== null && memory <= 4) || cores <= 6 || isMobile) {
    return 'mid';
  }

  // High Tier:
  // - Modern desktops/laptops with >= 8 cores and >= 8GB RAM
  return 'high';
}

export function useDeviceTier() {
  const [tier, setTier] = useState(() => getDeviceTier());

  useEffect(() => {
    const handleResize = () => {
      const nextTier = getDeviceTier();
      setTier((prev) => (prev !== nextTier ? nextTier : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return tier;
}

export default useDeviceTier;
