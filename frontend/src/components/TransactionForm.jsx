import { useState } from 'react';
import { createTransaction } from '../services/api';

function TransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    amount: '',
    senderId: '',
    receiverId: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTransaction({
        ...form,
        amount: Number(form.amount)
      });
      setForm({ amount: '', senderId: '', receiverId: '', location: '' });
      onSuccess();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <input
        name="senderId"
        type="text"
        placeholder="Sender ID"
        value={form.senderId}
        onChange={handleChange}
        required
      />
      <input
        name="receiverId"
        type="text"
        placeholder="Receiver ID"
        value={form.receiverId}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Create Transaction'}
      </button>
    </form>
  );
}

export default TransactionForm;