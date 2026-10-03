import express from 'express';
import {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
} from '../controllers/foundItemController.js';

const router = express.Router();

router.route('/')
  .post(createFoundItem)
  .get(getFoundItems);

router.route('/:id')
  .get(getFoundItemById);

export default router;
