function StatsBar({ transactions }) {
  const total = transactions.length;
  const fraudCount = transactions.filter((t) => t.isFraud).length;
  const fraudRate = total > 0 ? ((fraudCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <h3>{total}</h3>
        <p>Total Transactions</p>
      </div>
      <div className="stat-card fraud">
        <h3>{fraudCount}</h3>
        <p>Fraud Flagged</p>
      </div>
      <div className="stat-card">
        <h3>{fraudRate}%</h3>
        <p>Fraud Rate</p>
      </div>
    </div>
  );
}

export default StatsBar;