import { Request, Response } from 'express';
import { RideEstimateService } from '../services/ride-estimate.service';

export class RideEstimateController {
  static async createRide(req: Request, res: Response): Promise<Response> {
    try {
      const { origin, destination, customer_id } = req.body;

      const rideEstimate = await RideEstimateService.getRideEstimate(
        origin,
        destination,
      );

      const drivers = await RideEstimateService.availableDrivers(
        rideEstimate.distance,
      );

      const driversWithValues = await Promise.all(
        drivers.map(async (driver) => ({
          ...driver,
          value: await RideEstimateService.calculateValue(
            rideEstimate.distance,
            driver.rate_per_km,
          ),
        })),
      );

      return res.json({
        success: true,
        origin: rideEstimate.origin,
        destination: rideEstimate.destination,
        distance: rideEstimate.distance,
        duration: rideEstimate.duration,
        options: driversWithValues.map((driver) => {
          const { rate_per_km, ...driverDetails } = driver;
          return driverDetails;
        }),
        routeResponse: rideEstimate.routeResponse,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_DATA',
        error_description:
          'Os dados fornecidos no corpo da requisição são inválidos',
      });
    }
  }

  static async getRides(req: Request, res: Response): Promise<Response> {
    try {
      const { customer_id } = req.params;
      const { driver_id } = req.query;

      if (!customer_id || isNaN(Number(customer_id))) {
        return res.status(400).json({
          error_code: 'INVALID_CUSTOMER',
          error_description:
            'O ID do cliente é obrigatório e deve ser um número válido.',
        });
      }

      if (driver_id && isNaN(Number(driver_id))) {
        return res.status(400).json({
          error_code: 'INVALID_DRIVER',
          error_description: 'O ID do motorista deve ser um número válido.',
        });
      }

      const rides = await RideEstimateService.getRides(
        Number(customer_id),
        driver_id ? Number(driver_id) : undefined,
      );

      if (!rides.length) {
        return res.status(404).json({
          error_code: 'NO_RIDES_FOUND',
          error_description:
            'Nenhuma corrida encontrada para os critérios fornecidos.',
        });
      }

      return res.status(200).json({ customer_id, rides });
    } catch (error) {
      console.error('Erro ao buscar corridas:', error);
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description:
          'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
      });
    }
  }
}
