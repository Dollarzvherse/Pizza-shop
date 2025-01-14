// require("dotenv").config(); // Load environment variables from .env file
// const express = require("express");
// const cors = require("cors");
// const { Sequelize } = require("sequelize");
// const Card = require("./models/cardModel"); // Sequelize Card model
// const app = express();
// const PORT = process.env.PORT || 3000;

// /*************
//  * MIDDLEWARE
//  *************/
// app.use(cors({ origin: "*" }));
// app.use(express.json());

// /***************************************
//  * Algorithm for card number validation
//  ***************************************/
// const validateCardNumber = (cardNumber) => {
//   let sum = 0;
//   let alternate = false;
//   for (let i = cardNumber.length - 1; i >= 0; i--) {
//     let n = parseInt(cardNumber[i], 10);
//     if (alternate) {
//       n *= 2;
//       if (n > 9) n -= 9;
//     }
//     sum += n;
//     alternate = !alternate;
//   }
//   return sum % 10 === 0;
// };

// /**********
//  * ROUTES
//  **********/
// // Create a card
// app.post("/cards", async (req, res) => {
//   try {
//     const card = await Card.create(req.body);
//     res.status(201).json(card);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Retrieve all cards
// app.get("/cards", async (req, res) => {
//   try {
//     const cards = await Card.findAll();
//     res.status(200).json(cards);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving cards", error: err.message });
//   }
// });

// // Card Validation Endpoint
// app.post("/verifyCard", async (req, res) => {
//   try {
//     const { pizzaDetails, cardDetails } = req.body;

//     if (!pizzaDetails || !cardDetails) {
//       return res.status(400).json({ message: "Missing required data" });
//     }

//     const { amount, deliveryLocation } = pizzaDetails;

//     if (!amount || typeof amount !== "number" || amount <= 0) {
//       return res.status(400).json({ message: "Invalid pizza amount" });
//     }

//     if (!deliveryLocation || typeof deliveryLocation !== "string") {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing delivery location" });
//     }

//     const { cardHolderName, cardNumber, cardExpirationDate, cardSecurityCode } =
//       cardDetails;

//     if (
//       !cardHolderName ||
//       !cardNumber ||
//       !cardExpirationDate ||
//       !cardSecurityCode
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (!/^\d{16}$/.test(cardNumber)) {
//       return res
//         .status(400)
//         .json({ message: "Card number must be exactly 16 digits" });
//       ``;
//     }

//     const existingCard = await Card.findOne({ where: { cardNumber } });
//     if (existingCard) {
//       return res.status(400).json({ message: "Card number already exists" });
//     }

//     if (cardSecurityCode.length !== 3) {
//       return res
//         .status(400)
//         .json({ message: "Invalid security code length (must be 3 digits)" });
//     }

//     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpirationDate)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid expiration date format (MM/YY required)" });
//     }

//     const [month, year] = cardExpirationDate.split("/");
//     const currentDate = new Date();
//     const expiryDate = new Date(`20${year}`, month - 1);

//     if (expiryDate < currentDate) {
//       return res.status(400).json({ message: "Card has expired" });
//     }

//     if (!validateCardNumber(cardNumber)) {
//       return res.status(400).json({ message: "Invalid card number" });
//     }

//     const card = await Card.create({
//       cardHolderName,
//       cardNumber,
//       cardExpirationDate,
//       cardSecurityCode,
//     });

//     res.status(201).json({
//       message: "Card is valid",
//       deliveryDetails: {
//         amount,
//         deliveryLocation,
//       },
//     });
//   } catch (error) {
//     console.error(error.message);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });

// // Sequelize connection setup
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected...");
//     return sequelize.sync({ alter: true }); // Sync models with DB
//   })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error.message);
//   });

require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const { sequelize, Card } = require("./models/cardModel"); // Import sequelize and Card model
const app = express();
const PORT = process.env.PORT || 3000;

/*************
 * MIDDLEWARE
 *************/
app.use(cors({ origin: "*" }));
app.use(express.json());

/***************************************
 * Algorithm for card number validation
 ***************************************/
const validateCardNumber = (cardNumber) => {
  let sum = 0;
  let alternate = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

/**********
 * ROUTES
 **********/
// Create a card
app.post("/cards", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json(card);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Retrieve all cards
app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.status(200).json(cards);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving cards", error: err.message });
  }
});

// Card Validation Endpoint
app.post("/verifyCard", async (req, res) => {
  try {
    const { pizzaDetails, cardDetails } = req.body;

    if (!pizzaDetails || !cardDetails) {
      return res.status(400).json({ message: "Missing required data" });
    }

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

    if (
      !cardHolderName ||
      !cardNumber ||
      !cardExpirationDate ||
      !cardSecurityCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      return res
        .status(400)
        .json({ message: "Card number must be exactly 16 digits" });
    }

    const existingCard = await Card.findOne({ where: { cardNumber } });
    if (existingCard) {
      return res.status(400).json({ message: "Card number already exists" });
    }

    if (cardSecurityCode.length !== 3) {
      return res
        .status(400)
        .json({ message: "Invalid security code length (must be 3 digits)" });
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpirationDate)) {
      return res
        .status(400)
        .json({ message: "Invalid expiration date format (MM/YY required)" });
    }

    const [month, year] = cardExpirationDate.split("/");
    const currentDate = new Date();
    const expiryDate = new Date(`20${year}`, month - 1);

    if (expiryDate < currentDate) {
      return res.status(400).json({ message: "Card has expired" });
    }

    if (!validateCardNumber(cardNumber)) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    const card = await Card.create({
      cardHolderName,
      cardNumber,
      cardExpirationDate,
      cardSecurityCode,
    });

    res.status(201).json({
      message: "Card is valid",
      deliveryDetails: {
        amount,
        deliveryLocation,
      },
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/***************
 * DATABASE SETUP
 ***************/
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync({ alter: true }); // Sync models with DB
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
  });
