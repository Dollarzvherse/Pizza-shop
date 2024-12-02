const express = require("express");
const mongoose = require("mongoose");
const Card = require("./models/cardModel");
const cors = require("cors");
const app = express();

/*************
 * MIDDLEWARE
 *************/
app.use(cors({ origin: "*" }));
app.use(express.json());

/***************************************=
 * Algorithm for card number validation
 ***************************************/
const validateCardNumber = (cardNumber) => {
  let sum = 0;
  let alternate = false;
  console.log("Validating card number:", cardNumber);
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  console.log("Computed sum:", sum);
  return sum % 10 === 0;
};

/**********
 * ROUTES
 **********/
//Create a user
app.post("/users", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(200).json(card);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("HELLO PIZZA API");
});

app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving cards", error: err.message });
  }
});

/****************************
 * Card Validation Endpoint
 ****************************/
app.post("/verifyCard", async (req, res) => {
  try {
    const { pizzaDetails, cardDetails } = req.body;

    if (!pizzaDetails || !cardDetails) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Updated pizzaDetails validation
    const { amount, deliveryLocation } = pizzaDetails;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid pizza amount" });
    }

    if (!deliveryLocation || typeof deliveryLocation !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid or missing delivery location" });
    }

    const { cardHolderName, cardNumber, cardExpirationDate, cardSecurityCode } =
      cardDetails;

    /** Validate Card Details */
    if (
      !cardHolderName ||
      !cardNumber ||
      !cardExpirationDate ||
      !cardSecurityCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /** Validate card number format (exactly 16 digits) */
    if (!/^\d{16}$/.test(cardNumber)) {
      return res
        .status(400)
        .json({ message: "Card number must be exactly 16 digits" });
    }

    /** Check if card number already exists in the database */
    const existingCard = await Card.findOne({ cardNumber });
    if (existingCard) {
      return res.status(400).json({ message: "Card number already exists" });
    }

    /** Validate security code length */
    if (cardSecurityCode.length !== 3) {
      return res
        .status(400)
        .json({ message: "Invalid security code length (must be 3 digits)" });
    }

    /** Validate expiration date format (MM/YY) */
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpirationDate)) {
      return res
        .status(400)
        .json({ message: "Invalid expiration date format (MM/YY required)" });
    }

    /** Check card expiration date */
    const [month, year] = cardExpirationDate.split("/");
    const currentDate = new Date();
    const expiryDate = new Date(`20${year}`, month - 1);

    if (expiryDate < currentDate) {
      return res.status(400).json({ message: "Card has expired" });
    }

    /** Validate card number using validateCardNumber Logic */
    if (!validateCardNumber(cardNumber)) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    /** Save the card to the database */
    const card = new Card({
      cardHolderName,
      cardNumber,
      cardExpirationDate,
      cardSecurityCode,
    });
    await card.save();

    res.status(201).json({
      message: "Card is valid",
      deliveryDetails: {
        amount,
        deliveryLocation,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Card number already exists" });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://vj1502003:victor2003@card-verification.hxvgi.mongodb.net/Card-Verification?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Server is listening at port 3000`);
    });
  })
  .catch((error) => {
    console.error("Connection error:", error.message);
  });
