function TransactionTable({ transactions }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Amount</th>
          <th>Location</th>
          <th>Status</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className={t.isFraud ? 'fraud-row' : ''}>
            <td>{new Date(t.createdAt).toLocaleTimeString()}</td>
            <td>{t.senderId}</td>
            <td>{t.receiverId}</td>
            <td>₹{t.amount}</td>
            <td>{t.location}</td>
            <td>{t.isFraud ? '🚨 Flagged' : '✅ Clean'}</td>
            <td>{t.fraudReason || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;