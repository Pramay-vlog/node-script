const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  hashString: async (string) => await hash(string, 10),

  compareString: async (string, hash) => await compare(string, hash),

  validateEmptyFields: (payloadData, fields) => {
    let data4message = "please enter ";
    let array4fields = Object.keys(payloadData);
    let invalidFields = new Set();

    fields.forEach((field) => {
      if (!array4fields.includes(field)) {
        invalidFields.add(field);
      }
    });

    for (const key in payloadData) {
      if (fields.includes(key) && payloadData[key] === "") {
        invalidFields.add(key);
      }
    }
    if (invalidFields.size) {
      const array = Array.from(invalidFields);
      return data4message + array.join(", ");
    } else {
      return null;
    }
  },

  generateToken: (payload, expiry) => {
    if (expiry) {
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiry ? expiry : "",
      });
    } else {
      return jwt.sign(payload, process.env.JWT_SECRET);
    }
  },
};