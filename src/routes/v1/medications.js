//medications.js:
// GET/POST – /v1/medications/
const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { port, dbConfig } = require('./config');
const router = express.Router();

medSchema = Joi.object({
  name: Joi.string().alphanum().trim().required(),
  description: Joi.string().trim().required(),
});

//GET request
router.get('/medications', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute('SELECT * FROM medications');
    await con.close();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whopsy! server ir down :(' });
  }
});

//POST request
router.post('/medications', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await medSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data passed!' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO medications (name, description) VALUES (${mysql.escape(
        userInput.name
      )},${mysql.escape(userInput.description)})`
    );
    await con.end();
    return res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data passed!' });
  }
});

module.exports = router;
