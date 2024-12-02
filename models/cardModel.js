const mongoose = require("mongoose");

const userCardSchema = mongoose.Schema(
  {
    cardHolderName: {
      type: String,
      required: true,
      trim: true,
    },

    cardNumber: {
      type: String,
      required: true,
      unique: [true, "Please input valid card number"],
      minlength: 16,
      maxlength: 16,
      match: /^[0-9]+$/,
    },

    cardExpirationDate: {
      type: String,
      required: true,
      match: /^(0[1-9]|1[0-2])\/\d{2}$/,
    },
    cardSecurityCode: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 3,
      match: /^[0-9]+$/,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", userCardSchema);
module.exports = Card;
