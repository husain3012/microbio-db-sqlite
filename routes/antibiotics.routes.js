const express = require("express");
const router = express.Router();
const { addNew, getAll } = require("../controllers/antibiotics.controllers");

router.post("/antibiotic/create", addNew);
router.get("/antibiotic/getAll", getAll);


module.exports = router;
