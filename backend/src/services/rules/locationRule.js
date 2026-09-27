const prisma = require('../../prismaClient');

const TIME_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

async function checkLocationRule(senderId, currentLocation) {
  const windowStart = new Date(Date.now() - TIME_WINDOW_MS);

  const lastTransaction = await prisma.transaction.findFirst({
    where: {
      senderId: senderId,
      createdAt: { gte: windowStart }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (lastTransaction && lastTransaction.location !== currentLocation) {
    return {
      flagged: true,
      reason: `Sender switched location from ${lastTransaction.location} to ${currentLocation} within 2 minutes`
    };
  }
  return { flagged: false };
}

module.exports = checkLocationRule;