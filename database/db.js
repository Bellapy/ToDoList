const mongoose = require("mongoose");

const conectToDb = () => {
  mongoose
    .connect(
      process.env.MONGODB_URI, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB atlas conectado!"))
    .catch((err) => console.log(err));
};

module.exports = conectToDb;
