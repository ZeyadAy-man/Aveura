import { createContext, useMemo, useContext } from "react";
import { GPUTierDetector } from "./GPUDetector";
import { DeviceDetector } from "./DeviceDetector";

const GPUContext = createContext({ deviceType: 'laptop', tier: 3, quality: 'medium' });

export const GPUProvider = ({ children }) => {
  const deviceType = DeviceDetector();
  const gpuInfo = GPUTierDetector({ deviceType });
  
  const value = useMemo(() => ({
    deviceType,
    ...gpuInfo
  }), [deviceType, gpuInfo]);
  
  return <GPUContext.Provider value={value}>{children}</GPUContext.Provider>;
};

export const useGPU = () => useContext(GPUContext);