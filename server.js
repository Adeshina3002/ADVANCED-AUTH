require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.route');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3434;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(
    cors({
        origin: ["http://localhost:3000", "*"]
    })
)

// Routes
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('Home page...');
});


// Error Handler
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
