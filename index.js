const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all origins

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
  for (let i = 1; i <= num / 2; i++) {
    if (num % i === 0) sum += i;
  }
  return sum === num;
}

// Helper function to check if a number is Armstrong
function isArmstrong(num) {
  let digits = num.toString().split("");
  let sum = 0;
  let power = digits.length;
  for (let digit of digits) {
    sum += Math.pow(parseInt(digit), power);
  }
  return sum === num;
}

// Helper function to check if a number is odd or even
function getOddEven(num) {
  return num % 2 === 0 ? "even" : "odd";
}

// API endpoint to classify the number
app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  // Validate if the input is a valid integer
  if (isNaN(number) || number === "") {
    return res.status(400).json({ number: number, error: true });
  }

  const num = parseInt(number);

  // Generate the properties array
  let properties = [];

  if (isArmstrong(num)) properties.push("armstrong");
  properties.push(getOddEven(num));

  // Fetch the fun fact from numbersapi
  try {
    const funFact = await axios.get(`http://numbersapi.com/${num}?json`);
    res.status(200).json({
      number: num,
      is_prime: isPrime(num),
      is_perfect: isPerfect(num),
      properties: properties,
      digit_sum: num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0),
      fun_fact: funFact.data.text,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fun fact" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
