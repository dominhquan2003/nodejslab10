const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/lab10');
    console.log('connect successully');
  } catch (e) {
    console.log('connect fail');
  }
}
module.exports = { connect };
