const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { PORT, dbConfig } = require('./routes/v1/config');

require('dotenv').config();
//
const app = express();
//
const pets = require('./routes/v1/pets.js');
const medication = require('./routes/v1/medications.js');
const logs = require('./routes/v1/logs.js');
const prescriptions = require('./routes/v1/prescriptions.js');

//
app.use(express.json());
app.use(cors());
app.use('/v1/pets', pets);
app.use('/v1/medications', medication);
app.use('/v1/logs', logs);
app.use('/v1/prescriptions', prescriptions);
//

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
