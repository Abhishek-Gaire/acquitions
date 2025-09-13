import logger from '#config/logger.js';
import { signupSchema, signinSchema } from '#validations/auth.validation.js';
import { formatValidation } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: formatValidation(validationResult.error),
      });
    }

    const { name, email, role, password } = validationResult.data;
    const user = await createUser({ name, email, role, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info('User registered successfully.');
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error('Signup Error', err);

    if (err.message === 'User already exists') {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: formatValidation(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;
    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User ${user.email} signed in successfully.`);
    res.status(200).json({
      message: 'User signed in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error('Signin Error', err);

    if (err.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    if (err.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully.');
    res.status(200).json({
      message: 'User signed out successfully.',
    });
  } catch (err) {
    logger.error('Signout Error', err);
    next(err);
  }
};
