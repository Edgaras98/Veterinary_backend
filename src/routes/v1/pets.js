//GET/POST/DELETE - /v1/pets/
// delete - pakeičia archived į true (1).
// get - paduoda visus, kurie nėra archi)

const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { port, dbConfig } = require('./config');

const router = express.Router();

const today = new Date().toLocaleDateString('lt');

//Validation schema

petSchema = Joi.object({
  name: Joi.string().alphanum().trim().required(),
  dob: Joi.date().greater('2000-01-01').less(today).required(),
  client_email: Joi.string().trim().lowercase().required(),
});

//GET request Archived(false)

router.get('/pets', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute('SELECT * FROM pets WHERE archived = 0');
    await con.end();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whoopsy, DB Error!' });
  }
});
//POST request

router.post('/pets', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await petSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data passed!' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] =
      await con.execute(`INSERT INTO pets (name, dob, client_email) VALUES (${mysql.escape(
        userInput.name
      )},${mysql.escape(userInput.dob)},
      ${mysql.escape(userInput.client_email)})`);
    await con.end();
    return res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data passed!' });
  }
});

//DELETE request

router.delete('/pets/:id', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `UPDATE pets SET archived = 1 WHERE archived = 0 AND id= ${mysql.escape(
        req.params.id
      )}`
    );
    await con.end();
    res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data!' });
  }
});

module.exports = router;
