import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';

const router = express.Router();

// Public route (might want to protect this in production)
router.get('/', fetchAllUsers);

// Protected routes - require authentication
router.get('/:id', authenticate, fetchUserById);
router.put('/:id', authenticate, updateUserById);
router.delete('/:id', authenticate, deleteUserById);

export default router;
