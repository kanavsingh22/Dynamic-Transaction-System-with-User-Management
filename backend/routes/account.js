const express = require('express');
const { authMiddleware } = require('../middleware');
const { User, Account } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        acc_balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            console.log('Invalid amount:', amount);
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid amount"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(to)) {
            console.log('Invalid recipient userId:', to);
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient userId"
            });
        }

        const toUserId = new mongoose.Types.ObjectId(to);

        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            console.log('Insufficient balance or account not found');
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: toUserId }).session(session);

        if (!toAccount) {
            console.log('Recipient account not found');
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        const senderUpdateResult = await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        const recipientUpdateResult = await Account.updateOne(
            { userId: toUserId },
            { $inc: { balance: amount } }
        ).session(session);
        
        await session.commitTransaction();
        console.log('Transaction committed successfully');

        res.status(200).json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error("Error during transfer:", error);
        
        await session.abortTransaction();
        res.status(500).json({
            message: "Internal server error"
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;

module.exports = router;