import express from 'express';
import rideRoutes from './routes/ride.routes';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/ride', rideRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(process.env.GOOGLE_API_KEY);
});
