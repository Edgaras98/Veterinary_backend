//POST /v1/prescriptions/ - sukuriame naują vaistų išrašą.
// GET /v1/prescriptions/ - atsiunčiame vaistus su gyvūnų info (join su pets) ir su med info (join su medications)
const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { port, dbConfig } = require('./config');
const router = express.Router();

const preSchema = Joi.object({
  medication_id: Joi.number().required(),
  pet_id: Joi.number().required(),
  comment: Joi.string().trim().required(),
});

//GET request
router.get('/prescriptions/:id', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM prescriptions LEFT JOIN pets ON pets.id = prescriptions.pet_id WHERE prescriptions.pet_id = ${req.params.id}`
    );
    await con.close();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whopsy! server ir down :(' });
  }
});

//POST request

router.post('/prescriptions', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await preSchema.validateAsync(userInput);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data passed!' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO prescriptions (medication_id,pet_id,comment) VALUES (${mysql.escape(
        userInput.medication_id
      )},${mysql.escape(userInput.pet_id)},
      ${mysql.escape(userInput.comment)})`
    );
    await con.close();
    res.send(data);
  } catch {
    res.status(400).send({ err: 'invalid data passed' });
  }
});

module.exports = router;
