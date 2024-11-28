import { RideConfirmRepository } from '../repositories/ride-confirm.repository';
import { BadRequestError } from '../errors/BadRequestError';

export class RideConfirmService {
  private rideConfirmRepository: RideConfirmRepository;

  constructor() {
    this.rideConfirmRepository = new RideConfirmRepository();
  }

  async validateAndSaveRide(rideData: {
    customer_id: number;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: { id: number; name: string };
    value: number;
    date_created: string;
  }): Promise<void> {
    const { customer_id, origin, destination, distance, driver, value } =
      rideData;

    if (!origin || !destination) {
      throw new BadRequestError(
        'Os campos de origem e destino são obrigatórios.',
      );
    }
    if (origin === destination) {
      throw new BadRequestError('A origem e o destino não podem ser iguais.');
    }
    if (!customer_id) {
      throw new BadRequestError('O ID do cliente é obrigatório.');
    }
    if (!distance || distance <= 0) {
      throw new BadRequestError('A distância informada é inválida.');
    }
    if (!value || value <= 0) {
      throw new BadRequestError('O valor da viagem deve ser maior que zero.');
    }

    await this.validateDriver(driver);
    await this.rideConfirmRepository.saveRide(rideData);
  }

  private async validateDriver(driver: {
    id: number;
    name: string;
  }): Promise<void> {
    if (!driver || !driver.id || !driver.name) {
      throw new BadRequestError('Motorista inválido ou dados incompletos.');
    }

    const driverExists = await this.rideConfirmRepository.findDriverById(
      driver.id,
    );
    if (!driverExists) {
      throw new BadRequestError('Motorista não encontrado no sistema.');
    }
  }
}
