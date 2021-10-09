const express = require("express");
const router = express.Router();
const { bacteriaAntibiogram, yearlyAntibiogram } = require("../controllers/antibiogram.controller");

router.post("/antibiogram/bacteria", bacteriaAntibiogram);
router.post("/antibiogram/yearly", yearlyAntibiogram);

module.exports = router;
