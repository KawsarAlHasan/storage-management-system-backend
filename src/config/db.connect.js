const mongoose = require("mongoose");

exports.dbConnect = async () => {
  await mongoose.connect(process.env.DATABASE);
  console.log(`The Mongodb database is connected`);
};
