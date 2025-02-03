const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // Enable CORS for all origins

// Helper function to check if a number is Armstrong
function isArmstrong(num) {
  const digits = num.toString().split('');
  const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), digits.length), 0);
  return sum === num;
}

// Helper function to check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Helper function to check if a number is perfect
function isPerfect(num) {
  let sum = 0;
  for (let i = 1; i < num; i++) {
    if (num % i === 0) sum += i;
  }
  return sum === num;
}

// Route to classify number
app.get('/api/classify-number', async (req, res) => {
  const { number } = req.query;

  // Check if the input is a valid number (integer or float)
  const parsedNumber = parseFloat(number);

  if (isNaN(parsedNumber)) {
    return res.status(400).json({ number: number, error: true });
  }

  const num = parsedNumber; // Allow floating point or integer numbers
  const properties = [];
  if (isArmstrong(num)) properties.push("armstrong");
  if (num % 2 === 0) properties.push("even");
  else properties.push("odd");

  // Fetch fun fact from Numbers API
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math?json=true`);
    const funFact = response.data.text;

    // Return a successful response with the necessary data
    res.status(200).json({
      number: num,
      is_prime: isPrime(num),
      is_perfect: isPerfect(num),
      properties,
      digit_sum: num.toString().split('').reduce((sum, digit) => sum + Number(digit), 0),
      fun_fact: funFact
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fun fact' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
