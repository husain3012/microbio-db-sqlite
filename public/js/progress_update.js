$(function () {
  $(".panel-reaction-tables").hide();

  $("#sample-growth").hide();
  $("#sample-contaminated").hide();

  $(".bacteria-panel").each((i) => {
    let panel = $(".bacteria-panel")[i];

    if ($(panel).is(":checked")) {
      $("#" + panel.value).show();
      $("#" + panel.value).addClass("d-flex");
    }
  });

  let progress = $("#sample-progress").find(":selected").val();

  if (progress == "growth") {
    $("#sample-growth").show();
    $(".bacteria-panel").on("click", (e) => {
      let panel = e.target;
      if ($(panel).is(":checked")) {
        $("#" + panel.value).show();
        $("#" + panel.value).addClass("d-flex");
      } else {
        $("#" + panel.value).hide();
        $("#" + panel.value).removeClass("d-flex");
        $(`#${panel.value} input`).prop("checked", false);
        $(`#${panel.value} input`).prop("value", "");
      }
    });
  } else if (progress == "contaminated") {
    $("#sample-contaminated").show();
  }

  $("#sample-progress").on("change", (e) => {
    let progress = e.target.value;
    if (progress == "growth") {
      $("#sample-growth").show();
      $("#sample-contaminated").hide();
      $("#sample-contaminated textarea").text("");

      $(".bacteria-panel").on("click", (e) => {
        let panel = e.target;
        console.log(panel.value);
        if ($(panel).is(":checked")) {
          $("#" + panel.value).show();
          $("#" + panel.value).addClass("d-flex");
        } else {
          $("#" + panel.value).hide();
          $("#" + panel.value).removeClass("d-flex");
          $(`#${panel.value} input`).prop("checked", false);
          $(`#${panel.value} input`).prop("value", "");
        }
      });
    } else if (progress == "contaminated") {
      $("#sample-growth").hide();
      $("#sample-contaminated").show();
      $("#sample-growth input[type=radio]").prop("checked", false);
      $("#sample-growth input[type=text]").prop("value", "");
      $("#sample-growth input[type=number]").prop("value", "");
    } else {
      $("#sample-contaminated").hide();
      $("#sample-growth").hide();
      $("#sample-contaminated textarea").text("");

      $("#sample-growth input[type=radio]").prop("checked", false);
      $("#sample-growth input[type=text]").prop("value", "");
      $("#sample-growth input[type=number]").prop("value", "");
    }
  });
});
