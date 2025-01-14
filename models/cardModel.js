// const { Sequelize, DataTypes } = require("sequelize");
// require("dotenv").config(); // Load environment variables

// // Create a Sequelize instance using environment variables
// const sequelize = new Sequelize(
//   process.env.DB_NAME || "getdelightpizza",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   {
//     host: process.env.DB_HOST || "localhost", // Do not include the port here
//     port: process.env.DB_PORT || 3306, // Specify the port separately (default for MySQL is 3306)
//     dialect: process.env.DB_DIALECT || "mysql", // Default is MySQL
//     logging: false, // Disable SQL query logging (optional)
//   }
// );

// // Define the Card model
// const Card = sequelize.define(
//   "Card",
//   {
//     cardHolderName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true, // Ensures the value is not an empty string
//       },
//     },
//     cardNumber: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         len: [16, 16], // Ensures the card number is exactly 16 characters
//         isNumeric: true, // Ensures the value contains only numbers
//       },
//     },
//     cardExpirationDate: {
//       // Corrected property name
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         is: /^(0[1-9]|1[0-2])\/\d{2}$/, // Validates MM/YY format
//       },
//     },
//     cardSecurityCode: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [3, 3], // Ensures the security code is exactly 3 characters
//         isNumeric: true, // Ensures the value contains only numbers
//       },
//     },
//   },
//   {
//     tableName: "user_cards", // Specify table name in the database
//     timestamps: true, // Adds createdAt and updatedAt columns
//   }
// );

// // Test the database connection (optional)
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connection successful!");
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//   });

// module.exports = { sequelize, Card };

// const { Sequelize, DataTypes } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME || "getdelightpizza",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   {
//     host: process.env.DB_HOST || "localhost",
//     port: process.env.DB_PORT || 3306,
//     dialect: process.env.DB_DIALECT || "mysql",
//     logging: false,
//   }
// );

// const Card = sequelize.define(
//   "Card",
//   {
//     cardHolderName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     cardNumber: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         len: [16, 16],
//         isNumeric: true,
//       },
//     },
//     cardExpirationDate: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         is: /^(0[1-9]|1[0-2])\/\d{2}$/,
//       },
//     },
//     cardSecurityCode: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [3, 3],
//         isNumeric: true,
//       },
//     },
//   },
//   {
//     tableName: "user_cards",
//     timestamps: true,
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log("Database connection successful!"))
//   .catch((error) => console.error("Unable to connect to the database:", error));

// module.exports = Card;

const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config(); // Load environment variables

// Create a Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "getdelightpizza",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

// Define the Card model
const Card = sequelize.define(
  "Card",
  {
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [16, 16],
        isNumeric: true,
      },
    },
    cardExpirationDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(0[1-9]|1[0-2])\/\d{2}$/,
      },
    },
    cardSecurityCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 3],
        isNumeric: true,
      },
    },
  },
  {
    tableName: "user_cards",
    timestamps: true,
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connection successful!"))
  .catch((error) => console.error("Unable to connect to the database:", error));

// Export both sequelize and Card
module.exports = { sequelize, Card };
