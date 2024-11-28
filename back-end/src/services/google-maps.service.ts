import axios from 'axios';
import {
  DirectionsResponse,
  DirectionsRequest,
} from '../interfaces/google-maps.interface';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleMapsService {
  private static baseUrl = 'https://routes.googleapis.com';
  private static apiKey = process.env.GOOGLE_API_KEY;

  static async getDirections(
    origin: string,
    destination: string,
  ): Promise<DirectionsResponse['routes']> {
    try {
      if (!this.apiKey) {
        throw new Error('A chave de API do Google Maps precisa ser fornecida.');
      }

      const url = `${this.baseUrl}/directions/v2:computeRoutes?key=${this.apiKey}`;

      const request: DirectionsRequest = {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: 'DRIVE',
      };

      const headers = {
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation',
      };

      const response = await axios.post<DirectionsResponse>(url, request, {
        headers,
      });
      const routes = response.data.routes;

      if (!routes || routes.length === 0) {
        throw new Error('Nenhuma rota encontrada para os locais fornecidos.');
      }

      return routes;
    } catch (error) {
      throw new Error(
        `Erro ao buscar rotas no Google Maps: ${(error as Error).message}`,
      );
    }
  }
}
