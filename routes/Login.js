const express = require('express');
const Customermodel = require('../models/Customer');
const route=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Manishisbest';

route.post('/',[body('Password','Enter a valid password').exists(),body('Phonenumber','Enter a valid Mobilenumber').isMobilePhone()], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors});
    }
    const {Phonenumber,Password}=req.body;
    console.log(Phonenumber)
    try {
      const Customer= await Customermodel.findOne({Phonenumber});
      if (!Customer) {
        return res.status(400).json({ errors: errors.array()});
      }
      const passwordcompare= await bcrypt.compare(Password,Customer.Password)
      if (!passwordcompare) {
        return res.status(400).json({errors: errors.array()});
      }
      const data={
        Customer:{
         id:Customer.id
        }
      }
      const jwttoken=jwt.sign(data,JWT_SECRET)
      res.json({jwttoken})
    } catch (err) {
      res.json({ errors:'please enter a valid email', message: err.message})
    }
  })
  module.exports=route