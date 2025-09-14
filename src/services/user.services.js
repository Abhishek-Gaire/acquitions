import logger from "#config/logger.js";
import {db} from "#config/database.js";
import {users} from "#models/user.model.js";
import { eq } from 'drizzle-orm';

export const getAllUsers = async() => {
    try {
        return await db.select({
            id:users.id,
            email:users.email,
            name:users.name,
            role:users.role,
            created_at:users.createdAt,
            updated_at:users.updatedAt
        }).from(users);

    }catch (error){
        logger.error(error);
        throw new Error(error);
    }
}

export const getUserById = async (id) => {
    try {
        const [user] = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            created_at: users.createdAt,
            updated_at: users.updatedAt
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const updateUser = async (id, updates) => {
    try {
        // Check if user exists
        const [existingUser] = await db.select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Update the user
        const [updatedUser] = await db
            .update(users)
            .set({
                ...updates,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                created_at: users.createdAt,
                updated_at: users.updatedAt
            });

        return updatedUser;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        // Check if user exists
        const [existingUser] = await db.select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Delete the user
        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role
            });

        return deletedUser;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
