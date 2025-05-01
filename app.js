const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorMiddleware = require('./middlewares/errorMiddleware')
const empRoutes = require('./routes/empRoutes')

const app = express()
app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/emp', empRoutes);
app.use(errorMiddleware);

module.exports = app;