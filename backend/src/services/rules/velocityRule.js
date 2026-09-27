const prisma = require('../../prismaClient');

const TIME_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_TRANSACTIONS = 5;

async function checkVelocityRule(senderId) {
  const windowStart = new Date(Date.now() - TIME_WINDOW_MS);

  const recentCount = await prisma.transaction.count({
    where: {
      senderId: senderId,
      createdAt: { gte: windowStart }
    }
  });

  if (recentCount >= MAX_TRANSACTIONS) {
    return {
      flagged: true,
      reason: `Sender made ${recentCount} transactions in the last minute (limit: ${MAX_TRANSACTIONS})`
    };
  }
  return { flagged: false };
}

module.exports = checkVelocityRule;