import { api } from './axiosConfig';

interface RideConfirmRequest {
  customer_id: number;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
  date_created?: string;
}

export interface RideConfirmResponse {
  success: boolean;
  error_code?: string;
  error_description?: string;
}

export const rideConfirm = async (
  request: RideConfirmRequest,
): Promise<RideConfirmResponse> => {
  const response = await api.patch<RideConfirmResponse>(
    '/ride/confirm',
    request,
  );

  return response.data;
};
