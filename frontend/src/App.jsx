import { useEffect, useState } from 'react';
import { getTransactions, simulateTransactions } from './services/api';
import TransactionTable from './components/TransactionTable';
import StatsBar from './components/StatsBar';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await simulateTransactions(20);
      await fetchData();
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Fraud Detection Dashboard</h1>
      <StatsBar transactions={transactions} />
      <button onClick={handleSimulate} disabled={loading}>
        {loading ? 'Simulating...' : 'Simulate 20 Transactions'}
      </button>
      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default App;