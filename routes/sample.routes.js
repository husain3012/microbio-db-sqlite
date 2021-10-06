const express = require("express");
const router = express.Router();
const { createSample, getSample, getByDate, updateSample, generateReport, findSample, randomSampleGen } = require("../controllers/sample.controllers");

router.post("/sample/create", createSample);
router.post("/sample/update", updateSample);
router.post("/sample/search", findSample);
router.post("/sample/generate_samples", randomSampleGen);

router.get("/sample/getByDate", getByDate);

router.get("/sample/get/:sampleId", getSample);
router.get("/sample/report/:sampleId", generateReport);

module.exports = router;
