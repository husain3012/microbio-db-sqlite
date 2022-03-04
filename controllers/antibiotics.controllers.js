const Antibiotics = require("../models/antibiotics.model");
const axios = require("axios");
const _ = require("lodash");

exports.addNew = async (req, res) => {
  try {
    const { name, panel, shortName } = req.body;
    const newAntibiotic = await Antibiotics.create({
      name,
      shortName: _.toLower(shortName),
      panel: _.toLower(panel),
    });
    return res.status(201).json({
      success: true,
      data: newAntibiotic,
    message: "Added Successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to add new antibiotic!",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await Antibiotics.findAll();
    return res.json({
      status: true,
      message: "Retrieved Successfully!",
      data: result,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.getPanel = async (req, res) => {
  try {
    const foundPanel = await Antibiotics.findAll({ where: { panel: _.toLower(req.params.panel) } });
    if (foundPanel.length > 0) {
      return res.json({
        status: true,
        message: "Retrieved Successfully!",
        data: foundPanel,
      });
    }
    return res.json({
      status: false,
      message: "No panel found!",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
