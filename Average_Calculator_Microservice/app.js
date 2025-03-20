const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500;
const TEST_SERVER = 'http://20.244.56.144/test';
const numberStore = {
  p: { windowPrevState: [], windowCurrState: [] },
  f: { windowPrevState: [], windowCurrState: [] },
  e: { windowPrevState: [], windowCurrState: [] },
  r: { windowPrevState: [], windowCurrState: [] }
};

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc2MTI1LCJpYXQiOjE3NDI0NzU4MjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMyNzE3ZWU0LTI2NDQtNDI5ZS1iNTc3LThiNTk0YWVjMDQ2YyIsInN1YiI6ImRnNzk1MEBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNIFVuaXZlcnNpdHkiLCJjbGllbnRJRCI6IjMyNzE3ZWU0LTI2NDQtNDI5ZS1iNTc3LThiNTk0YWVjMDQ2YyIsImNsaWVudFNlY3JldCI6IkJCUW1SWHlYQWF6S2dobkYiLCJvd25lck5hbWUiOiJEaHJ1diBHdXB0YSIsIm93bmVyRW1haWwiOiJkZzc5NTBAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjIxMTAzMDAxMDIwMSJ9.1XYLv37kiQDuWltFANMfO6buzSKVWHCfoA0GHPlGvZc';

async function fetchNumbers(type) {
  let endpoint;
  switch (type) {
    case 'p':
      endpoint = '/primes';
      break;
    case 'f':
      endpoint = '/fibo';
      break;
    case 'e':
      endpoint = '/even';
      break;
    case 'r':
      endpoint = '/rand';
      break;
    default:
      throw new Error('Invalid number type');
  }

  try {
    const response = await axios.get(`${TEST_SERVER}${endpoint}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      timeout: TIMEOUT
    });
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error.message);
    return [];
  }
}

function updateWindow(type, newNumbers) {
  const store = numberStore[type];
  store.windowPrevState = [...store.windowCurrState];
  let uniqueNumbers = [...new Set([...store.windowCurrState, ...newNumbers])];
  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers = uniqueNumbers.slice(uniqueNumbers.length - WINDOW_SIZE);
  }
  
  store.windowCurrState = uniqueNumbers;
}
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}
app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;

  if (!['p', 'f', 'e', 'r'].includes(type)) {
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r.' });
  }
  
  try {
    const windowPrevState = [...numberStore[type].windowCurrState];
    const newNumbers = await fetchNumbers(type);
    updateWindow(type, newNumbers);
    const avg = calculateAverage(numberStore[type].windowCurrState);
    const response = {
      windowPrevState: windowPrevState,
      windowCurrState: numberStore[type].windowCurrState,
      numbers: newNumbers,
      avg: avg
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
  console.log(`Access via: http://localhost:${PORT}/numbers/{type}`);
  console.log('Supported types: p (prime), f (fibonacci), e (even), r (random)');
});


