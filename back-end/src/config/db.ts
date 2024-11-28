import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'taxiapp',
  password: 'password',
  port: 5432,
});

export default pool;
