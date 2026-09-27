import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export async function getTransactions() {
  const res = await axios.get(`${API_BASE}/transactions`);
  return res.data;
}

export async function createTransaction(data) {
  const res = await axios.post(`${API_BASE}/transactions`, data);
  return res.data;
}
export async function simulateTransactions(count) {
  const res = await axios.post(`${API_BASE}/simulate`, { count });
  return res.data;
}