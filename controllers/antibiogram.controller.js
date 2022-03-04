const Op = require("sequelize").Op;
const Sample = require("../models/sample.model");
const axios = require("axios");
const SLR = require("ml-regression").SLR;

exports.bacteriaAntibiogram = async (req, res) => {
  const today = new Date();
  const past = new Date();
  past.setMonth(today.getMonth() - 3);

  let startDate = past.toISOString();
  let endDate = today.toISOString();
  if (req.body.startDate && req.body.endDate) {
    startDate = new Date(req.body.startDate);
    endDate = new Date(req.body.endDate);
  }
  let bacteria = req.body.bacteria;

  try {
    const samples = await Sample.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });

    let atb_data = {};
    if (samples.length > 0) {
      samples.forEach((sample) => {
        calculateAntibiogram(sample, bacteria, atb_data);
      });
    }
    console.log(atb_data);

    return res.json(atb_data);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.trendAnalysis = async (req, res) => {
  let startYear = new Date(req.body.startYear + "-01-01");
  let endYear = new Date(req.body.endYear - 1 + "-12-31");
  let bacteria = req.body.bacteria;

  let years = [];
  let futureYears = [];
  let currentYear = new Date();
  for (let i = req.body.startYear; i <= req.body.endYear; i++) {
    if (i <= currentYear.getFullYear()) {
      years.push(i);
    }else{
      break;
    }
  }
  console.log(years);

  try {
    const result = await Sample.findAll({ where: { createdAt: { [Op.between]: [startYear, endYear ]} } });
    console.log(result);
    let atb_data = {};
    if (result.length > 0) {
      years.forEach((year) => {
        atb_data[year] = {};
        result.forEach((sample) => {
          if (sample.createdAt.getFullYear() === year) {
            calculateAntibiogram(sample, bacteria, atb_data[year]);
          }
        });
      });
    }
    let atb_trend = { ...atb_data };
    console.log(atb_trend);

    return res.json(atb_trend);
  } catch (err) {
    return res.status(500).send(err);
  }
};

const calculateAntibiogram = (sample, bacteria, atb_data) => {
  // staphylococcusName
  if (sample.sensitivity && sample.sensitivity.staphylococcusName === bacteria) {
    sample.sensitivity.staphylococcusPanel.forEach((atb) => {
      !atb_data[atb.antib] && (atb_data[atb.antib] = {});
      if (atb.sensitivity === "S") {
        atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
      }
      atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
    });
  }
  // streptococcusName
  if (sample.sensitivity && sample.sensitivity.streptococcusName === bacteria) {
    sample.sensitivity.streptococcusPanel.forEach((atb) => {
      !atb_data[atb.antib] && (atb_data[atb.antib] = {});
      if (atb.sensitivity === "S") {
        atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
      }
      atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
    });
  }
  // gramPositiveName
  if (sample.sensitivity && sample.sensitivity.gramPositiveName === bacteria) {
    sample.sensitivity.gramPositivePanel.forEach((atb) => {
      !atb_data[atb.antib] && (atb_data[atb.antib] = {});
      if (atb.sensitivity === "S") {
        atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
      }
      atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
    });
  }
  // pseudomonasName
  if (sample.sensitivity && sample.sensitivity.pseudomonasName === bacteria) {
    sample.sensitivity.pseudomonasPanel.forEach((atb) => {
      !atb_data[atb.antib] && (atb_data[atb.antib] = {});
      if (atb.sensitivity === "S") {
        atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
      }
      atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
    });
  }
};

// function getRegression(atb_data, years, atb) {
//   let inputs = [];
//   let outputs = [];
//   for (let i = 0; i < years.length - 1; i++) {
//     inputs.push(years[i]);
//   }
//   inputs.forEach((year) => {
//     if (atb_data[year][atb]) {
//       outputs.push(atb_data[year][atb].sus / atb_data[year][atb].total);
//     } else {
//       outputs.push(0);
//     }
//   });
//   return new SLR(inputs, outputs);
// }
