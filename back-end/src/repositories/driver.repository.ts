import pool from '../config/db';
import { Driver } from '../interfaces/driver.interface';

export class DriverRepository {
  static async getAllDrivers(): Promise<Driver[]> {
    const query = 'SELECT * FROM drivers';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getDriverById(id: string): Promise<Driver | null> {
    const query = 'SELECT * FROM drivers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async addDriver(driver: Driver): Promise<void> {
    const query = `
      INSERT INTO drivers (id, name, car, rating, description, feedback, rate_per_km, min_km)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      driver.id,
      driver.name,
      driver.car,
      driver.rating,
      driver.description,
      JSON.stringify(driver.feedback),
      driver.rate_per_km,
      driver.min_km,
    ];
    await pool.query(query, values);
  }

  static async updateDriver(
    id: string,
    updatedData: Partial<Driver>,
  ): Promise<void> {
    const fields = Object.keys(updatedData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updatedData)];
    const query = `UPDATE drivers SET ${fields} WHERE id = $1`;
    await pool.query(query, values);
  }

  static async deleteDriver(id: string): Promise<void> {
    const query = 'DELETE FROM drivers WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async findRides(
    customerId: number,
    driverId?: number,
  ): Promise<any[]> {
    let query = `
        SELECT 
            r.id, 
            r.origin, 
            r.destination, 
            r.distance, 
            r.duration, 
            r.value, 
            r.driver_id,
            d.name AS driver_name,
            r.date_created
        FROM rides r
        INNER JOIN drivers d ON r.driver_id = d.id
        WHERE r.customer_id = $1
    `;

    const params: any[] = [customerId];

    if (driverId) {
      query += ' AND r.driver_id = $2';
      params.push(driverId);
    }

    query += ' ORDER BY r.id DESC';

    try {
      const { rows } = await pool.query(query, params);
      return rows.map((row) => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        distance: row.distance,
        duration: row.duration,
        value: row.value,
        driver: {
          id: row.driver_id,
          name: row.driver_name,
        },
        date_created: row.date_created,
      }));
    } catch (error) {
      console.error('Erro ao executar query:', error);
      throw error;
    }
  }
}
