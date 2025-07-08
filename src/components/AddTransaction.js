import React from 'react';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Add Transaction</h2>
      <TransactionForm onAdd={() => {}} />
    </div>
  );
};

export default AddTransaction;