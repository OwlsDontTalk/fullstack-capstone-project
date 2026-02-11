/*jshint esversion: 9 */
const express = require('express');
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../models/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();

        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const { id } = req.params;

        let gift = null;

        if (ObjectId.isValid(id)) {
            gift = await collection.findOne({ _id: new ObjectId(id) });
        }

        if (!gift) {
            gift = await collection.findOne({ id });
        }

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne({ ...req.body, createdBy: req.user.userId });

        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
