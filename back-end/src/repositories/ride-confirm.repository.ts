import pool from '../config/db';

export class RideConfirmRepository {
  async findDriverById(id: number): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM drivers WHERE id = $1';
    const result = await pool.query(query, [id]);

    return parseInt(result.rows[0].count, 10) > 0;
  }

  async saveRide(rideData: {
    customer_id: number;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: { id: number; name: string };
    value: number;
    date_created: string;
  }): Promise<void> {
    const query = `
      INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, driver_name, value, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      rideData.customer_id,
      rideData.origin,
      rideData.destination,
      rideData.distance,
      rideData.duration,
      rideData.driver.id,
      rideData.driver.name,
      rideData.value,
      rideData.date_created,
    ];

    await pool.query(query, values);
  }
}
