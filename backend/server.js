const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./src/prismaClient');
const checkAmountRule = require('./src/services/rules/amountRule');
const checkVelocityRule = require('./src/services/rules/velocityRule');
const checkLocationRule = require('./src/services/rules/locationRule');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fraud Detection API is running');
});

// Test route: create a transaction
app.post('/transactions', async (req, res) => {
  try {
    const { amount, senderId, receiverId, location } = req.body;

    // Run all fraud checks
    const [amountCheck, velocityCheck, locationCheck] = await Promise.all([
      checkAmountRule(senderId, amount),
      checkVelocityRule(senderId),
      checkLocationRule(senderId, location)
    ]);
    // Combine results — flagged if ANY rule flags it
    const isFraud = amountCheck.flagged || velocityCheck.flagged || locationCheck.flagged;
    const reasons = [amountCheck, velocityCheck, locationCheck]
      .filter(r => r.flagged)
      .map(r => r.reason)
      .join(' | ');

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        senderId,
        receiverId,
        location,
        isFraud,
        fraudReason: isFraud ? reasons : null
      }
    });

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Fetch all transactions (newest first)
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Simulate a batch of random transactions (for demo purposes)
app.post('/simulate', async (req, res) => {
  try {
    const { count = 10 } = req.body;
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Kolkata'];
    const senders = ['sim_user1', 'sim_user2', 'sim_user3'];
    const results = [];

    for (let i = 0; i < count; i++) {
      const senderId = senders[Math.floor(Math.random() * senders.length)];
      const amount = Math.floor(Math.random() * 100000) + 100;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const receiverId = 'sim_receiver';

      const [amountCheck, velocityCheck, locationCheck] = await Promise.all([
        checkAmountRule(senderId, amount),
        checkVelocityRule(senderId),
        checkLocationRule(senderId, location)
      ]);

      const isFraud = amountCheck.flagged || velocityCheck.flagged || locationCheck.flagged;
      const reasons = [amountCheck, velocityCheck, locationCheck]
        .filter(r => r.flagged)
        .map(r => r.reason)
        .join(' | ');

      const transaction = await prisma.transaction.create({
        data: { amount, senderId, receiverId, location, isFraud, fraudReason: isFraud ? reasons : null }
      });

      results.push(transaction);
    }

    res.json({ created: results.length, transactions: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});