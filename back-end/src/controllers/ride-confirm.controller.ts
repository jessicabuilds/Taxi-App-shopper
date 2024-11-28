import { Request, Response } from 'express';
import { RideConfirmService } from '../services/ride-confirm.service';

export class RideConfirmController {
  private rideConfirmService: RideConfirmService;

  constructor() {
    this.rideConfirmService = new RideConfirmService();
  }

  async confirmRide(req: Request, res: Response): Promise<Response> {
    const {
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value,
      date_created,
    } = req.body;

    try {
      await this.rideConfirmService.validateAndSaveRide({
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver,
        value,
        date_created,
      });

      return res
        .status(200)
        .json({ message: 'Viagem confirmada com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao confirmar a viagem.' });
    }
  }
}
