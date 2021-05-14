const mongoose = require("mongoose");

const DB =
  "mongodb+srv://PriyankaDB:PriyankaDBPassword@cluster0.rqzx6.mongodb.net/registration?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Mongodb running`);
  })
  .catch(() => {
    console.log(`Mongodb connection failed`);
  });
// mongoose
// .connect("mongodb://localhost:27017/registration", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// })
// .then(() => {
//   console.log(`Mongodb running`);
// })
// .catch(() => {
//   console.log(`Mongodb connection failed`);
// });
