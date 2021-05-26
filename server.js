const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/items", require("./routes/items"));
app.use("/api/orders", require("./routes/orders"));

app.listen(5000, () => {
    console.log("Listening on port 5000");
});