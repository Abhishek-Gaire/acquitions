import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/user.services.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/user.validation.js';
import { hashPassword } from '#services/auth.service.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users');
    const allUsers = await getAllUsers();
    res.status(200).json({
      message: 'All users successfully Fetched',
      data: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const validatedParams = userIdSchema.parse(req.params);
    const { id } = validatedParams;

    logger.info(`Getting user with ID: ${id}`);
    const user = await getUserById(id);

    res.status(200).json({
      message: 'User successfully fetched',
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    logger.error(error);
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const validatedParams = userIdSchema.parse(req.params);
    const { id } = validatedParams;

    const validatedBody = updateUserSchema.parse(req.body);

    // Check if authenticated user is trying to update their own profile or if they're admin
    const isOwnProfile = req.user && req.user.id === id;
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    // Only admins can change roles
    if (validatedBody.role && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles',
      });
    }

    // Hash password if it's being updated
    const updates = { ...validatedBody };
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    logger.info(`Updating user with ID: ${id}`);
    const updatedUser = await updateUser(id, updates);

    res.status(200).json({
      message: 'User successfully updated',
      data: updatedUser,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    logger.error(error);
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const validatedParams = userIdSchema.parse(req.params);
    const { id } = validatedParams;

    // Check if authenticated user is admin or trying to delete their own account
    const isOwnProfile = req.user && req.user.id === id;
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message:
          'You can only delete your own profile or must be an administrator',
      });
    }

    logger.info(`Deleting user with ID: ${id}`);
    const deletedUser = await deleteUser(id);

    res.status(200).json({
      message: 'User successfully deleted',
      data: deletedUser,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    logger.error(error);
    next(error);
  }
};
