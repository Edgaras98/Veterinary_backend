// POST /v1/logs/ - sukuriame naują įrašą
// GET /v1/logs/ - pasiimame įrašą su gyveno info (t.y. join su pets lentele).

const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { port, dbConfig } = require('./config');

const router = express.Router();

const logSchema = Joi.object({
  pet_id: Joi.number().required(),
  description: Joi.string().trim().required(),
  status: Joi.string().trim().required(),
});

//Get all

//GET request by Id GET WHAT HAPPEND TO PET
router.get('/logs/:id', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT pets.name, pets.dob, logs.description, logs.status, pets.client_email, prescriptions.medication_id FROM logs LEFT JOIN pets ON pets.id = logs.pet_id LEFT JOIN prescriptions ON logs.pet_id = prescriptions.pet_id WHERE pets.id =${req.params.id}`
    );
    await con.close();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whopsy! server ir down :(' });
  }
});

//POST request

router.post('/logs', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await logSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data passed!' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO logs (pet_id, description, status) VALUES (${mysql.escape(
        userInput.pet_id
      )},${mysql.escape(userInput.description)},
      ${mysql.escape(userInput.status)})`
    );

    await con.end();
    res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data passed!' });
  }
});

module.exports = router;
