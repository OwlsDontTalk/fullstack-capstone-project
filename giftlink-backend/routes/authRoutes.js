/*jshint esversion: 9 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pino = require('pino');
const connectToDatabase = require('../models/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const logger = pino();

const createToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
};

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userDocument = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(userDocument);
        const user = { ...userDocument, _id: result.insertedId };
        const token = createToken(user);

        logger.info({ email: user.email }, 'User registered successfully');

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`.trim(),
            },
        });
    } catch (error) {
        logger.error({ err: error }, 'Error registering user');
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await usersCollection.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = createToken(user);

        logger.info({ email: user.email }, 'User logged in successfully');

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`.trim(),
            },
        });
    } catch (error) {
        logger.error({ err: error }, 'Error logging in user');
        res.status(500).json({ message: 'Error logging in user' });
    }
});

router.put(
    '/update',
    authMiddleware,
    [
        body('firstName').optional().isLength({ min: 1 }).withMessage('First name cannot be empty'),
        body('lastName').optional().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
        body('name').optional().isLength({ min: 1 }).withMessage('Name cannot be empty'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error({ errors: errors.array() }, 'Validation errors in update request');
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const emailHeader = req.headers.email;
            if (!emailHeader) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ message: 'Email not found in the request headers' });
            }

            const email = emailHeader.toLowerCase();

            if (req.user && req.user.email && req.user.email.toLowerCase() !== email) {
                return res.status(403).json({ message: 'Email header does not match authenticated user' });
            }

            const db = await connectToDatabase();
            const usersCollection = db.collection('users');

            const existingUser = await usersCollection.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const updateFields = {};
            const { firstName, lastName, password, name } = req.body;

            if (typeof firstName === 'string' && firstName.trim().length > 0) {
                updateFields.firstName = firstName.trim();
            }

            if (typeof lastName === 'string' && lastName.trim().length > 0) {
                updateFields.lastName = lastName.trim();
            }

            if (typeof name === 'string' && name.trim().length > 0) {
                const parts = name.trim().split(' ');
                updateFields.firstName = parts.shift();
                updateFields.lastName = parts.join(' ');
            }

            if (typeof password === 'string' && password.length > 0) {
                updateFields.password = await bcrypt.hash(password, 10);
            }

            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ message: 'No fields provided for update.' });
            }

            updateFields.updatedAt = new Date();

            const updateResult = await usersCollection.updateOne(
                { _id: existingUser._id },
                { $set: updateFields }
            );

            if (!updateResult.acknowledged) {
                logger.error({ updateResult }, 'Mongo update failed to acknowledge');
                return res.status(500).json({ message: 'Failed to update user profile' });
            }

            const updatedUser = await usersCollection.findOne({ _id: existingUser._id });

            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to load updated user profile' });
            }

            const token = createToken(updatedUser);
            const fullName = [updatedUser.firstName, updatedUser.lastName].filter(Boolean).join(' ').trim();

            logger.info({ email: updatedUser.email }, 'User profile updated');

            res.json({
                token,
                user: {
                    id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    name: fullName || updatedUser.firstName || '',
                },
            });
        } catch (error) {
            logger.error({ err: error }, 'Error updating user');
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

module.exports = router;
