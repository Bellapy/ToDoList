const mongoose = require("mongoose");

const conectToDb = () => {
  mongoose
    .connect(
      "mongodb+srv://isabellaemerichs:xQSvrue2x9GbRyZj@cluster0.mgxxepm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB atlas conectado!"))
    .catch((err) => console.log(err));
};

module.exports = conectToDb;
