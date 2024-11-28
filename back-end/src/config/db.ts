import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'taxiapp',
  password: 'password',
  port: 5432,
});
