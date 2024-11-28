import { api } from './axiosConfig';

export interface Ride {
  id: string;
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  value: string;
  driver: {
    id: number;
    name: string;
  };
  date_created: string;
}

export interface rideHistoryResponse {
  customer_id: number;
  rides: Ride[];
}

export const rideHistory = async (
  customerId: number | undefined,
  driverId: number,
): Promise<rideHistoryResponse> => {
  const response = await api.get<rideHistoryResponse>(
    `/ride/${customerId}?driver_id=${driverId}`,
  );

  return response.data;
};
