const Op = require("sequelize").Op;

const Sample = require("../models/sample.model");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./sessionData");
const axios = require("axios");
const { dialog } = require("electron");
const phantomjs = require("phantomjs-prebuilt");
const pdf = require("html-pdf");
const { nanoid } = require("nanoid");

exports.createSample = async (req, res) => {
  let level = parseInt(localStorage.getItem("level"));
  if (level > 0) {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
  const newSample = {
    sample_id: req.body.sampleId || nanoid(),
    patientName: req.body.patientName,
    age: req.body.age,
    sex: req.body.sex,
    cadsNumber: req.body.cadsNumber,
    specimen: req.body.specimen,
    sampleDate: req.body.specimenDate,
    department: req.body.department,
    physician: req.body.physician,
    diagnosis: req.body.diagnosis,
    examRequired: req.body.examRequired,
  };
  try {
    const sample = await Sample.create(newSample);
    return res.status(201).json({
      status: true,
      message: "Sample created successfully!",
      data: sample,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateSample = async (req, res) => {
  const sample_id = req.body.sample_id;
  delete req.body.sample_id;
  // update sample
  try {
    const sample = await Sample.update(req.body, {
      where: { sample_id: sample_id },
    });
    return res.status(201).json({
      status: true,
      message: "Sample updated successfully!",
      data: sample,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getSample = async (req, res) => {
  console.log(req.params);
  try {
    const sample = await Sample.findOne({
      where: { sample_id: req.params.sampleId },
    });
    return res.status(201).json({
      status: true,
      message: "Sample found successfully!",
      data: sample,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getByDate = async (req, res) => {
  const today = new Date();
  const past = new Date();
  past.setMonth(today.getMonth() - 3);

  let startDate = past.toISOString();
  let endDate = today.toISOString();
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    endDate = new Date(req.query.endDate);
  }

  try {
    const foundSamples = await Sample.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      limit: req.query.limit || 1000,
      order: [["createdAt", "DESC"]],
    });
    return res.json({
      status: true,
      message: foundSamples.length + " records retrieved!",
      data: foundSamples,
    });
  } catch (error) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.generateReport = async (req, res) => {
  Sample.findOne({ sample_id: req.params.sampleId }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json({
        message: "Sample not found!",
      });
    } else {
      dialog.showOpenDialog({ properties: ["openFile", "openDirectory"] }).then((result) => {
        const options = {
          phantomPath: phantomjs.path,
          width: "396mm",
          height: "280mm",
          orientation: "landscape",
        };
        axios
          .get("http://localhost:3000/printTemplate/" + req.params.sampleId)
          .then((response) => {
            pdf.create(response.data, options).toFile(result.filePaths[0] + "/" + req.params.sampleId + "_report.pdf", (err, pdfres) => {
              if (err) {
                console.log(err);
              }
              res.status(200).send(pdfres);
            });
          })
          .catch((error) => {
            res.send(error);
          });
      });
    }
  });
};

exports.findSample = async (req, res) => {
  console.log("-----------------------------------------------------\n", req.body);
  console.log("-----------------------------------------------------\n");
  let searchFields = {};
  // Validate name
  if (req.body.patientName) {
    let patientName = "%" + req.body.patientName.split(" ").join("%") + "%";
    searchFields = { ...searchFields, patientName: { [Op.like]: patientName } };
  }
  // Validate ID
  if (req.body.sample_id) {
    searchFields = { ...searchFields, sample_id: req.body.sample_id };
  }
  // Validate sex
  if (req.body.sex) {
    searchFields = { ...searchFields, sex: req.body.sex };
  }
  // Validate age
  if (req.body.ageFrom) {
    let ageFrom, ageTo;
    ageFrom = req.body.ageFrom;
    // If ageTo has been entered
    if (req.body.ageTo) {
      ageTo = req.body.ageTo;
      // In case the user exchanges the inputs
      if (ageFrom > ageTo) {
        ageFrom = ageTo;
        ageTo = req.body.ageFrom;
      }
      searchFields = { ...searchFields, age: { [Op.between]: [ageFrom, ageTo] } };
    } else {
      // If ageTo has not been entered
      searchFields = { ...searchFields, age: ageFrom };
    }
  }
  // Validate Recieved on date
  if (req.body.specimenDateFrom) {
    let recievedFrom, recievedTo;
    recievedFrom = req.body.specimenDateFrom;
    // If recievedTo has been entered
    if (req.body.specimenDateTo) {
      recievedTo = req.body.specimenDateTo;
      // In case the user exchanges the inputs
      if (recievedFrom > recievedTo) {
        recievedFrom = recievedTo;
        recievedTo = req.body.specimenDateFrom;
      }
      searchFields = { ...searchFields, createdAt: { [Op.between]: [new Date(recievedFrom), new Date(recievedTo)] } };
    } else {
      // If recievedTo has not been entered
      searchFields = { ...searchFields, createdAt: { [Op.between]: [new Date(recievedFrom), new Date()] } };
    }
  }
  // Validate Dept
  if (req.body.department) {
    searchFields = { ...searchFields, department: req.body.department };
  }
  // Validate Physician/ Surgeon
  if (req.body.physician) {
    let physician = "%" + req.body.physician + "%";
    searchFields = { ...searchFields, physician: { [Op.like]: physician } };
  }
  // Validate Specimen
  if (req.body.specimen) {
    searchFields = { ...searchFields, specimen: req.body.specimen };
  }
  // Validate Panel
  if (req.body.panel) {
    const panel = `sensitivity.${req.body.panel}`;
    // If bacteria name was entered
    if (req.body.bacteria) {
      searchFields = { ...searchFields, [panel]: req.body.bacteria };
    } else {
      // If bacteria name was not entered
      searchFields = { ...searchFields, [panel]: { $exists: true, $ne: "" } };
    }
  }
  // Now send this data to database and perform the search
  console.log(searchFields);
  try {
    const found_samples = await Sample.findAll({
      where: searchFields,
      order: [["createdAt", "DESC"]],
      limit: req.query.limit || 1000,
    });
    console.log(found_samples);
    return res.json({
      status: true,
      message: found_samples.length + " records retrieved!",
      data: found_samples,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(err);
  }
};

exports.randomSampleGen = async (req, res) => {
  let count = req.body.count || 1;
  let i;
  const sex = ["f", "m", "o"],
    specimen = ["puss", "blood", "urine"];
  const dept = ["microbiology", "pathology", "forensicMed", "medicine", "neuroSurgery", "obstetricsGynecology", "ophthalmology", "orthopaedicSurgery", "pediatrics", "radiology", "vascularSurgery", "other"],
    sensitivityArr = ["S", "I", "R"];
  const names = ["Adrak", "Lahsun", "Doraemon", "Chota Bheem", "Raju", "Mirchi", "Doc Oct", "May Parker", "Uncle Ben"];
  let date,
    end = new Date(),
    sensitivity = {},
    staphPanel = [];
  pseudoPanel = [];
  let randomSamples = [];
  for (i = 0; i < count; i++) {
    date = new Date(Math.floor(Math.random() * end.getTime()));
    let createdDate = new Date();
    createdDate.setMonth(createdDate.getMonth() - Math.floor(Math.random() * 48));
    createdDate.setMonth(createdDate.getMonth() - Math.floor(Math.random() * 25));
    let bacteria = ["staphylococcus", "staphylococcus2", "staphylococcus3"];

    sensitivity = {
      growthTime: Math.floor(Math.random() * 60),
      aerobic: true,
      anaerobic: false,
      bacterialCount: Math.floor(Math.random() * 1000),
      staphylococcusName: bacteria[Math.floor(Math.random() * bacteria.length)],
      staphylococcusPanel: staphPanel,
      streptococcusName: "",
      streptococcusPanel: [],
      gramNegativeName: "",
      gramNegativePanel: [],
      pseudomonasName: "Pseudomonas",
      pseudomonasPanel: pseudoPanel,
    };
    // This array can be automated (by loops) to consist of all the panel (by array) names if needed
    staphPanel = [
      {
        antib: "AZM",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "CD",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "CX",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "AMX",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "AMC",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "COT",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "Lx",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "DOX",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "Va",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
    ];
    pseudoPanel = [
      {
        antib: "CAZ",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "G",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "Ak",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
      {
        antib: "Pit",
        sensitivity: sensitivityArr[Math.floor(Math.random() * sensitivityArr.length)],
      },
    ];
    const sample = {
      sample_id: createdDate.getFullYear() + "_" + nanoid(10),
      patientName: names[Math.floor(Math.random() * names.length)],
      age: 10 + Math.floor(Math.random() * 90),
      sex: sex[Math.floor(Math.random() * sex.length)],
      createdAt: createdDate,
      specimen: specimen[Math.floor(Math.random() * specimen.length)],
      sampleDate: date,
      department: dept[Math.floor(Math.random() * dept.length)],
      physician: names[Math.floor(Math.random() * names.length)],
      sensitivity: sensitivity,
      examRequired: "Analysis",
      progress: "growth",
    };
    randomSamples.push(sample);
  }
  try {
    const newSample = await Sample.bulkCreate(randomSamples);
    return res.json({
      status: true,
      message: count + " samples created successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
