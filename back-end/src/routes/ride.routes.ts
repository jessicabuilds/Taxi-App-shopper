import { Router, Request, Response } from 'express';
import { RideEstimateController } from '../controllers/ride-estimate.controller';
import { RideConfirmController } from '../controllers/ride-confirm.controller';

const router = Router();
const rideConfirmController = new RideConfirmController();

router.post('/estimate', async (req: Request, res: Response) => {
  await RideEstimateController.createRide(req, res);
});

router.patch('/confirm', async (req: Request, res: Response) => {
  await rideConfirmController.confirmRide(req, res);
});

router.get('/:customer_id', async (req: Request, res: Response) => {
  await RideEstimateController.getRides(req, res);
});

export default router;
