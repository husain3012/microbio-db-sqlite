const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const cors = require("cors");
const sampleRoute = require("./routes/sample.routes");
const antibioticRoutes = require("./routes/antibiotics.routes");
const authRoutes = require("./routes/auth.routes");
const antibiogram = require("./routes/antibiogram.routes");
const jwt = require("jsonwebtoken");
const { requireAuth, checkUser } = require("./middleware/auth.middleware");
const cookieParser = require("cookie-parser");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./sessionData");
const morgan = require("morgan");
const db = require("./utils/database");
const User = require("./models/auth.model");
// const Sensitivity = require("./models/sensitivity.model");

// connect to database
// Sample.hasOne(Sensitivity);
db.sync()
  .then( () => {
    console.log("Database connected");
    // create default user if not exists
    User.findOne({ where: { username: "admin" } }).then(async(user) => {
      if (!user) {
        const defaultUser = await User.create({
          username: "admin",
          password: "admin",
          level: 0,
        });
        console.log("Default user created", defaultUser);
      }
    });
  })
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else {
  console.log = function (d) {
    log_file.write(util.format(d) + "\n");
    log_stdout.write(util.format(d) + "\n");
  };
  app.use(
    morgan("common", {
      stream: fs.createWriteStream("./access.log", { flags: "a" }),
    })
  );
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
cors;

const serverRoot = "http://localhost:" + (process.env.PORT || "3000");

app.get("/", (req, res) => {
  res.redirect("/records");
});

app.get("/records", requireAuth, (req, res) => {
  axios.get(serverRoot + "/api/sample/getByDate").then((response) => {
    if (response.status) {
      res.render("index", { records: response.data.data, user: req.user });
    }
  });
});

app.post("/records", requireAuth, (req, res) => {
  let endDate = new Date();
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  if (req.body.startDate != "") {
    startDate = new Date(req.body.startDate);
  }
  if (req.body.endDate != "") {
    endDate = new Date(req.body.endDate);
  }
  axios.get(serverRoot + "/api/sample/getByDate?startDate=" + startDate.toISOString() + "&endDate=" + endDate.toISOString()).then((response) => {
    if (response.status) {
      res.render("index", { records: response.data.data, user: req.user });
    }
  });
});

app.get("/add_new_entry", requireAuth, (req, res) => {
  res.render("newentry", { user: req.user });
});

app.post("/add_new_entry", requireAuth, (req, res) => {
  axios.post(serverRoot + "/api/sample/create", req.body).then((response) => {
    if (response.status) {
      res.redirect("/update_progress/" + response.data.data.sample_id);
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  if (req.body.username && req.body.password) {
    axios.post(serverRoot + "/api/auth/login", req.body).then((response) => {
      if (response.status) {
        res.cookie("token", response.data.token, { expiresIn: "1d" });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user._id);
        localStorage.setItem("level", response.data.user.level);

        res.redirect("/");
      }
    });
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get("/update_progress/:sample_id", requireAuth, (req, res) => {
  let sample_id = req.params.sample_id;
  axios.get(serverRoot + "/api/sample/get/" + sample_id).then((response) => {
    axios.get(serverRoot + "/api/antibiotic/getAll").then((antibioticResponse) => {
      const staphylococcus = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "staphylococcus");
      const streptococuss = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "streptococuss");
      const gramNegative = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "gramNegative");
      const pseudomonas = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "pseudomonas");

      res.render("update_sample", { sample: response.data.data, staphylococcus, streptococuss, gramNegative, pseudomonas });
    });
  });
});

app.post("/update_progress/", requireAuth, (req, res) => {
  const data = req.body;
  axios.get(serverRoot + "/api/antibiotic/getAll").then((antibioticResponse) => {
    const staphylococcusData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "staphylococcus");
    const streptococussData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "streptococuss");
    const gramNegativeData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "gramNegative");
    const pseudomonasData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "pseudomonas");

    const staphylococcusPanel = [];
    const streptococussPanel = [];
    const gramNegativePanel = [];
    const pseudomonasPanel = [];

    staphylococcusData.forEach((antibiotic) => {
      if (req.body[antibiotic.panel + "$" + antibiotic.name]) {
        staphylococcusPanel.push({
          antib: antibiotic.name,
          sensitivity: req.body[antibiotic.panel + "$" + antibiotic.name],
        });
      }
    });
    streptococussData.forEach((antibiotic) => {
      if (req.body[antibiotic.panel + "$" + antibiotic.name]) {
        streptococussPanel.push({
          antib: antibiotic.name,
          sensitivity: req.body[antibiotic.panel + "$" + antibiotic.name],
        });
      }
    });
    gramNegativeData.forEach((antibiotic) => {
      if (req.body[antibiotic.panel + "$" + antibiotic.name]) {
        gramNegativePanel.push({
          antib: antibiotic.name,
          sensitivity: req.body[antibiotic.panel + "$" + antibiotic.name],
        });
      }
    });
    pseudomonasData.forEach((antibiotic) => {
      if (req.body[antibiotic.panel + "$" + antibiotic.name]) {
        pseudomonasPanel.push({
          antib: antibiotic.name,
          sensitivity: req.body[antibiotic.panel + "$" + antibiotic.name],
        });
      }
    });

    let sensitivity = {
      growthTime: data.growth_time,
      aerobic: data.growth_type === "aerobic",
      anaerobic: data.growth_type === "anaerobic",
      bacterialCount: data.bacterialCount,
      staphylococcusName: data.staphylococcusName,
      streptococussName: data.streptococussName,
      gramNegativeName: data.gramNegativeName,
      pseudomonasName: data.pseudomonasName,
      staphylococcusPanel,
      streptococussPanel,
      gramNegativePanel,
      pseudomonasPanel,
    };

    const formattedData = {
      sample_id: data.sample_id,
      progress: data.progress,
      remarks: data.remarks,
      sensitivity,
    };

    axios.post(serverRoot + "/api/sample/update", formattedData).then((response) => {
      if (response.status) {
        res.redirect("/");
      }
    });
  });
});

app.get("/sample_info/:sample_id", requireAuth, (req, res) => {
  axios.get(serverRoot + "/api/sample/get/" + req.params.sample_id).then((response) => {
    if (response.status) {
      res.render("sample_details", { sample: response.data.data, user: req.user });
    }
  });
});

app.post("/search", requireAuth, (req, res) => {
  let query = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== null && v !== ""));

  axios.post(serverRoot + "/api/sample/search", query).then((response) => {
    if (response.status) {
      res.render("index", { records: response.data.data, user: req.user });
    }
  });
});

app.get("/printReport/:sample_id", requireAuth, (req, res) => {
  axios.get(serverRoot + "/api/sample/get/" + req.params.sample_id).then((response) => {
    axios.get(serverRoot + "/api/antibiotic/getAll").then((antibioticResponse) => {
      const staphylococcusData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "staphylococcus");
      const streptococussData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "streptococuss");
      const gramNegativeData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "gramNegative");
      const pseudomonasData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "pseudomonas");

      axios.get(serverRoot + "/api/sample/report/" + req.params.sample_id).then((print) => {
        if (response.status) {
          res.redirect("/");
          // res.render("print_report", { sample: response.data.data, staphylococcusData, streptococussData, gramNegativeData, pseudomonasData, printed: print.data.filename, user: req.user });
        }
      });
    });
  });
});

app.get("/printTemplate/:sample_id", (req, res) => {
  axios.get(serverRoot + "/api/sample/get/" + req.params.sample_id).then((response) => {
    axios.get(serverRoot + "/api/antibiotic/getAll").then((antibioticResponse) => {
      const staphylococcusData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "staphylococcus");
      const streptococussData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "streptococuss");
      const gramNegativeData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "gramNegative");
      const pseudomonasData = antibioticResponse.data.data.filter((antibiotic) => antibiotic.panel === "pseudomonas");

      if (response.status) {
        res.render("reportTemplate", { sample: response.data.data, staphylococcusData, streptococussData, gramNegativeData, pseudomonasData });
      }
    });
  });
});

app.get("/antibiogram", requireAuth, (req, res) => {
  res.render("antibiogram", { antibiogram, user: req.user });
});

app.get("/trend_analysis", requireAuth, (req, res) => {
  res.render("trend_analysis", { user: req.user });
});

app.use("/api", sampleRoute);
app.use("/api", antibioticRoutes);
app.use("/api", antibiogram);
app.use("/api", authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get("env") === "development") {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render("error", {
//       message: err.message,
//       error: err,
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render("error", {
//     message: err.message,
//     error: {},
//   });
// });
//   ***************************  //

const server = app.listen(3000, () => console.log(`Express server listening on port 3000`));

module.exports = app;
