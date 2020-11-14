const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const Customer = require('../models/Customer');

router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

router.post('/customers', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: `Customer with the id ${req.params.id} is Not Found`,
    });
  }
});

router.put('/customers/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: `Customer with the id ${req.params.id} is Not Found`,
    });
  }
});

router.delete('/customers/:id', verifyToken, async (req, res) => {
  try {
    const customers = await Customer.findOneAndRemove({ _id: req.params.id });

    res.status(204).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: `Customer with the id ${req.params.id} is Not Found`,
    });
  }
});

module.exports = router;
