import { useEffect, useState } from "react";

const detectDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
  const isDesktop = /win|mac|linux/i.test(platform) && !isMobile && !isTablet;
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  return 'laptop';
};

export const DeviceDetector = () => {
  const [deviceType, setDeviceType] = useState('laptop');
  
  useEffect(() => {
    const detected = detectDeviceType();
    setDeviceType(detected);
    console.log('📱 Device Type Detected:', detected.toUpperCase());
  }, []);
  
  return deviceType;
};