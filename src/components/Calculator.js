import React, { useState } from 'react';
import '../styles/Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        setInput(eval(input).toString());
      } catch (error) {
        setInput('Error');
      }
    } else if (value === 'C') {
      setInput('');
    } else {
      setInput(input + value);
    }
  };

  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];

  return (
    <div className="calculator-container">
      <h2>Calculator</h2>
      <input type="text" className="calculator-display" value={input} readOnly />
      <div className="calculator-buttons">
        {buttons.map((btn, index) => (
          <button key={index} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
