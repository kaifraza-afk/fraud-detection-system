const prisma = require('../../prismaClient');

const DEFAULT_THRESHOLD = 50000; // used when sender has no history yet
const MULTIPLIER = 3; // flag if amount is 3x sender's average

async function checkAmountRule(senderId, amount) {
  // Get this sender's past transactions
  const pastTransactions = await prisma.transaction.findMany({
    where: { senderId },
    select: { amount: true }
  });

  // New user with no history — fall back to fixed threshold
  if (pastTransactions.length === 0) {
    if (amount > DEFAULT_THRESHOLD) {
      return {
        flagged: true,
        reason: `New sender's amount ₹${amount} exceeds default threshold of ₹${DEFAULT_THRESHOLD}`
      };
    }
    return { flagged: false };
  }

  // Calculate this sender's average transaction amount
  const total = pastTransactions.reduce((sum, t) => sum + t.amount, 0);
  const average = total / pastTransactions.length;
  const dynamicThreshold = average * MULTIPLIER;

  if (amount > dynamicThreshold) {
    return {
      flagged: true,
      reason: `Amount ₹${amount} is ${MULTIPLIER}x higher than sender's average of ₹${average.toFixed(2)}`
    };
  }
  return { flagged: false };
}

module.exports = checkAmountRule;