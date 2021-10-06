const Sample = require("../models/sample.model");

exports.bacteriaAntibiogram = async (req, res) => {
  console.log(req.query);
  const today = new Date();
  const past = new Date();
  past.setMonth(today.getMonth() - 3);

  let startDate = past.toISOString();
  let endDate = today.toISOString();
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    endDate = new Date(req.query.endDate);
  }
  let bacteria = req.query.bacteria;

  Sample.find({ createdAt: { $gte: startDate, $lte: endDate } })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      let atb_data = {};

      result.forEach((sample) => {
        // staphylococcusName
        if (sample.sensitivity.staphylococcusName === bacteria) {
          sample.sensitivity.staphylococcusPanel.forEach((atb) => {
            console.log(atb);
            !atb_data[atb.antib] && (atb_data[atb.antib] = {});
            if (atb.sensitivity === "S") {
              atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
            }
            atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
          });
        }
        // streptococcusName
        if (sample.sensitivity.streptococcusName === bacteria) {
          sample.sensitivity.streptococcusPanel.forEach((atb) => {
            console.log(atb);
            !atb_data[atb.antib] && (atb_data[atb.antib] = {});
            if (atb.sensitivity === "S") {
              atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
            }
            atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
          });
        }
        // gramPositiveName
        if (sample.sensitivity.gramPositiveName === bacteria) {
          sample.sensitivity.gramPositivePanel.forEach((atb) => {
            console.log(atb);
            !atb_data[atb.antib] && (atb_data[atb.antib] = {});
            if (atb.sensitivity === "S") {
              atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
            }
            atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
          });
        }
        // pseudomonasName
        if (sample.sensitivity.pseudomonasName === bacteria) {
          sample.sensitivity.pseudomonasPanel.forEach((atb) => {
            console.log(atb);
            !atb_data[atb.antib] && (atb_data[atb.antib] = {});
            if (atb.sensitivity === "S") {
              atb_data[atb.antib].sus ? atb_data[atb.antib].sus++ : (atb_data[atb.antib].sus = 1);
            }
            atb_data[atb.antib].total ? atb_data[atb.antib].total++ : (atb_data[atb.antib].total = 1);
          });
        }
      });
      console.log("printing atb data");
      console.log(atb_data);
      return res.json(atb_data);
    });
};
