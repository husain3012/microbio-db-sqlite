const { default: axios } = require("axios");

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

axios
  .get("https://api.github.com/repos/husain3012/microbio-db-sqlite/releases/latest")
  .then(function (response) {
    var version = response.data.tag_name;
    var currentVersion = app.getVersion();
    var updateAvailable = false;
    var release_url = response.data.html_url;

    if (version !== currentVersion) {
      updateAvailable = true;
    }

    if (updateAvailable) {
      alert("A new version of Microbio DB is available. Ckick OK to update to " + version + "");
      window.open(release_url, "_blank");
    } else {
      $("#update-available").hide();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
