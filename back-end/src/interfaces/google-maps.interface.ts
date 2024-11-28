export interface DirectionsResponse {
  routes: Array<{
    legs: Array<{
      startLocation: Location;
      endLocation: Location;
      start_address: string;
      end_address: string;
    }>;
    distanceMeters: number;
    duration: string;
    polyline: Polyline;
  }>;
}

export interface RideEstimate {
  routes: Route[];
}

export interface Route {
  legs: Leg[];
  distanceMeters: number;
  duration: string;
  polyline: Polyline;
}

export interface Leg {
  startLocation: Location;
  endLocation: Location;
}

export interface Location {
  latLng: LatLng;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Polyline {
  encodedPolyline: string;
}

export interface DirectionsRequest {
  origin: LocationInput;
  destination: LocationInput;
  travelMode: 'DRIVE';
}

export interface LocationInput {
  address: string;
}
