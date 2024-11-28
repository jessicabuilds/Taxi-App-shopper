import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  RideEstimateResponse,
  RideContextType,
  ExtendedRideEstimateResponse,
} from '../api/rideEstimate';

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [estimate, setEstimate] = useState<ExtendedRideEstimateResponse | null>(
    null,
  );

  const saveEstimate = (
    estimateData: RideEstimateResponse,
    inputs?: {
      driverId: number;
      customerId?: number | undefined;
      origin?: string | undefined;
      destination?: string | undefined;
    },
  ) => {
    const inputsWithDefaults = {
      ...inputs,
      driverId: inputs?.driverId ?? 0,
    };
    setEstimate({
      ...estimateData,
      inputs: inputsWithDefaults,
    });
  };

  return (
    <RideContext.Provider value={{ estimate, saveEstimate }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide deve ser usado dentro de um RideProvider');
  }
  return context;
};
