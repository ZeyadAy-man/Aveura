import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const detectDevice = (width) => {
      if (width >= 1920) {
        return {
          tier: 1,
          name: 'Ultra Performance',
          limits: 'No limits',
          type: 'Desktop PCs'
        };
      } else if (width >= 1440) {
        return {
          tier: 2,
          name: 'High Performance',
          limits: 'Strong, limited',
          type: 'Gaming laptops'
        };
      } else if (width >= 1024) {
        return {
          tier: 3,
          name: 'Moderate Performance',
          limits: 'Entry / integrated',
          type: 'Laptops, Mini PCs'
        };
      } else if (width >= 768) {
        return {
          tier: 4,
          name: 'Basic Performance',
          limits: 'Minimal',
          type: 'Office devices'
        };
      } else {
        return {
          tier: 5,
          name: 'Mobile / Fixed',
          limits: 'Non-upgradeable',
          type: 'Phones, tablets'
        };
      }
    };

    const updateDevice = () => {
      const width = window.innerWidth;
      setDeviceType({ ...detectDevice(width), width });
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return deviceType;
};