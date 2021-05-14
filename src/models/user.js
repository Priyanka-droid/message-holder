const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  messages: [
    {
      message: {
        type: String,
      },
    },
  ],
});

// generating tokens

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.S_KEY);
    this.tokens = this.tokens.concat({ token: token });
    console.log(token);
    console.log("token generated");
    await this.save();
    return token;
  } catch (e) {
    console.log(`error part ${e}`);
    res.send(`error part ${e}`);
  }
};

// converting password into hash
// userSchema.pre("save", async function (next) {
//   console.log("initial password " + this.password);
//   if (this.isModified()) {
//     console.log("this is running for login also");
//     this.confirmpassword = await bcrypt.hash(this.password, 10);
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   console.log("hashed password" + this.password);
//   next();
// });

const UserData = new mongoose.model("UserData", userSchema);
module.exports = UserData;

// mongodb+srv://PriyankaDB:<password>@cluster0.rqzx6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
