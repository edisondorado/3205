import React, { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
var cancelTokenSource = axios.CancelToken.source();

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [results, setResults] = useState<Array<{ email: string; number: string }>>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateNumber = (number: string) => {
    const re = /^\d{2}-\d{2}-\d{2}$/;
    return re.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (number && !validateNumber(number)) {
      setError('Invalid number format');
      return;
    }
    
    if (isLoading) {
      setIsLoading(false)
      cancelTokenSource.cancel()
    } else {
      cancelTokenSource = axios.CancelToken.source();
    }

    setIsLoading(true)
    axios.post('http://localhost:3000/search', 
      { email, number: number.replace(/-/g, '') },
      {
        cancelToken: cancelTokenSource.token
      })
      .then(res => {
        setResults(res.data);
      })
      .catch(function (e) {
        if (axios.isCancel(e)) {
          console.error(e.message);
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number:</label>
          <InputMask
            mask="99-99-99"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {results.map((result, index) => (
          <div key={index}>
            <p>Email: {result.email}</p>
            <p>Number: {result.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



export default App;