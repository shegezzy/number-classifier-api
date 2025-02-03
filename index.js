const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all origins

// Helper function to check if a number is prime
function isPrime(n) {
  if (n < 2 || !Number.isInteger(n)) return false; // Prime numbers must be whole and ≥ 2
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// Helper function to check if a number is perfect
function isPerfect(n) {
  if (!Number.isInteger(n) || n <= 0) return false; // Only whole positive numbers can be perfect
  let sum = 0;
  for (let i = 1; i < n; i++) {
    if (n % i === 0) sum += i;
  }
  return sum === n;
}

// Helper function to check if a number is Armstrong
function isArmstrong(n) {
  if (!Number.isInteger(n)) return false; // Armstrong numbers must be whole numbers
  let digits = Math.abs(n).toString().split("");
  let sum = digits.reduce((acc, digit) => acc + Math.pow(parseInt(digit), digits.length), 0);
  return sum === Math.abs(n);
}

// API endpoint to classify the number
app.get("/", (req, res) => {
  res.send("Welcome to the Number Classification API! Use /api/classify-number?number=<your_number> to classify a number.");
});

app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  // Ensure the number is a valid number (accepts both integers and floats)
  let num;
  try {
    num = parseFloat(number);
  } catch (err) {
    return res.status(400).json({ error: "Invalid input. Please provide a valid number." });
  }

  // If the number is not a valid number or is not an integer
  if (isNaN(num)) {
    return res.status(400).json({ error: "Invalid input. Please provide a valid number." });
  }

  // Generate the properties array based on number classifications
  let properties = [];

  // Only include "armstrong", "odd", "even"
  const isArmstrongNumber = isArmstrong(num);
  if (isArmstrongNumber) properties.push("armstrong");

  const isEven = num % 2 === 0;
  if (isEven) properties.push("even");
  else properties.push("odd");

  // Calculate the digit sum
  const digitSum = num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);

  // Generate the fun fact dynamically for Armstrong numbers
  let funFact = null;
  if (isArmstrongNumber) {
    funFact = `${num} is an Armstrong number because ` + num
      .toString()
      .split("")
      .map((digit) => `${digit}^${num.toString().length}`)
      .join(" + ") + ` = ${num}`;
  }

  // Classification checks
  const isPrimeNumber = isPrime(num);
  const isPerfectNumber = isPerfect(num);

  // Build the response dynamically
  const response = {
    number: num,
    is_prime: isPrime(num), // Boolean for is_prime
    is_perfect: isPerfect(num), // Boolean for is_perfect
    properties: properties,
    digit_sum: digitSum,
    fun_fact: funFact || "No fact found."
  };

  // Return valid JSON response with a status code of 200
  return res.status(200).json(response);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
