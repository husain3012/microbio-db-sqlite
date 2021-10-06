const express = require("express");
const router = express.Router();
const {bacteriaAntibiogram} = require("../controllers/antibiogram.controller");

router.get("/antibiogram/bacteria", bacteriaAntibiogram);






module.exports = router;
