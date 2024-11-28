export interface Driver {
  id: string;
  name: string;
  car: string;
  rating: number;
  feedback: string;
  description: string;
  rate_per_km: number | undefined;
  min_km: number;
}
