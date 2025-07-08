
import React from 'react';
import TransactionList from '../components/TransactionList';

const MyTransactions = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>My Transactions</h2>
      <TransactionList />
    </div>
  );
};

export default MyTransactions;