require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const UserData = require("../src/models/user");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
require("../src/db/conn");
const app = express();
const auth = require("./middleware/auth");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password !== confirmpassword) {
      res.send("password does not match");
    } else {
      const createData = new UserData({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        gender: req.body.gender,
      });
      //   middleware to generate token
      createData.confirmpassword = await bcrypt.hash(confirmpassword, 10);
      createData.password = await bcrypt.hash(password, 10);
      console.log(confirmpassword, password);
      const token = await createData.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 100000),
        httpOnly: true,
      });
      //   console.log(cookie);

      // const result = await createData.save();

      //   console.log(req.body);
      res.status(200).render("index");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secret", auth, (req, res) => {
  console.log(`this is cookie ${req.cookies.jwt}`);
  res.render("secret");
});
app.post("/secret", auth, async (req, res) => {
  try {
    req.user.messages = req.user.messages.concat({ message: req.message });
    await req.user.save();
    res.status(200);
    res.render("secret");
  } catch (e) {
    res.status(500).send(e);
  }
});
app.get("/secret-page", auth, (req, res) => {
  req.user.messagesOnly = req.user.messages.map((curr_element) => {
    return curr_element.message;
  });
  req.user.messagesOnly = req.user.messagesOnly.filter((curr_element) => {
    return curr_element != null;
  });

  res.send(req.user.messagesOnly);
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await UserData.findOne({ email: email });
    // console.log(userEmail);

    console.log(password);
    const isMatch = await bcrypt.compare(password, userEmail.password);
    console.log(isMatch);
    const token = await userEmail.generateAuthToken();
    console.log(password);
    console.log(userEmail.password);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 100000),
      httpOnly: true,
      //   secure: true,
    });
    if (isMatch) {
      res.render("index");
    } else {
      res.send("wrong credentials");
    }
  } catch (e) {
    res.status(404).send("wrong credentials email not found");
  }
});

// create token
// const jwt = require("jsonwebtoken");
// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "609a280ba90f90302851e3a9" },
//     "mynameispriyankaandthisismysecretkey",
//     { expiresIn: "1 minute" }
//   );
//   console.log(token);
//   const userVer = await jwt.verify(
//     token,
//     "mynameispriyankaandthisismysecretkey"
//   );
//   console.log(userVer);
// };
// createToken();
app.get("/logout", auth, async (req, res) => {
  try {
    console.log("runs second");
    req.user.tokens = req.user.tokens.filter((curr_element) => {
      return curr_element.token !== req.token;
    });
    res.clearCookie("jwt");
    console.log("logout successful");
    await req.user.save();
    res.render("login");
  } catch (e) {
    res.status(500).send(e);
  }
});
app.get("/logoutall", auth, async (req, res) => {
  try {
    console.log("runs second");
    req.user.tokens = [];
    res.clearCookie("jwt");
    console.log("logout successful");
    await req.user.save();
    res.render("login");
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`node started at ${port}`);
});
