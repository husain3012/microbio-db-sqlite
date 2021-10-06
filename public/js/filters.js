let appliedFilter = {};

const handleFilters = (e) => {
  let filterType = e.target.attributes.filter.value;
  appliedFilter[filterType] = e.target.value;
  if (e.target.value === "all") {
    delete appliedFilter[filterType];
  }
  filterData();
};

const filterData = () => {
  $(".sample-card").each(function (i, sample) {
    let sampleProp = {};
    if (appliedFilter.age) {
      sampleProp.age = $(sample).attr("age");
    }
    if (appliedFilter.sex) {
      sampleProp.sex = $(sample).attr("sex");
    }
    if (appliedFilter.progress) {
      sampleProp.progress = $(sample).attr("progress");
    }
    if (appliedFilter.specimen) {
      sampleProp.specimen = $(sample).attr("specimen");
    }
    if (_.isEqual(appliedFilter, sampleProp)) {
      $(sample).show();
    } else {
      $(sample).hide();
    }
  });
};

$("#filters").on("change", handleFilters);
$("#filters").on("keyup", handleFilters);

console.log("filters.js loaded");
