import { api } from './axiosConfig';

export interface RideEstimateRequest {
  customer_id: number;
  origin: string;
  destination: string;
  driverId?: number;
}

export interface RideEstimateResponse {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  distance: number;
  duration: string;
  options: {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
    inputs?: {
      driverId: number;
      customerId?: number | undefined;
      origin?: string | undefined;
      destination?: string | undefined;
    };
  }[];

  routeResponse: {
    legs: {
      startLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
      endLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
    }[];
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
  }[];
}

export type ExtendedRideEstimateResponse = RideEstimateResponse & {
  inputs?: {
    driverId: number;
    customerId?: number | undefined;
    origin?: string | undefined;
    destination?: string | undefined;
  };
};

export interface RideContextType {
  estimate: ExtendedRideEstimateResponse | null;
  saveEstimate: (
    estimate: RideEstimateResponse,
    inputs?: {
      driverId: number;
      customerId?: number | undefined;
      origin?: string | undefined;
      destination?: string | undefined;
    },
  ) => void;
}

export const rideEstimate = async (
  request: RideEstimateRequest,
): Promise<RideEstimateResponse> => {
  const response = await api.post<RideEstimateResponse>(
    '/ride/estimate',
    request,
  );

  return response.data;
};
