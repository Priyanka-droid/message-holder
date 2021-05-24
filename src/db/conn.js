const mongoose = require("mongoose");

const DB = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.rqzx6.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
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
