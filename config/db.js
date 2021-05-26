const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        await mongoose.set('debug', true)
        console.log('MongoDb Connected..');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;