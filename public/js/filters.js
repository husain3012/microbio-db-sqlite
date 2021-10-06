let appliedFilter = {};

const handleFilters = (e) => {
  let filterType = e.target.attributes.filter.value;
  if (filterType === "age") {
    let age1 = e.target.value.split("-")[0];
    let age2 = e.target.value.split("-")[1] || age1;
    appliedFilter[filterType] = [age1, age2];
    if (age1 === "" && age2 === "" && appliedFilter.age) {
      delete appliedFilter.age;
    }
  } else {
    appliedFilter[filterType] = e.target.value;
  }

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
      if (sampleProp.age >= appliedFilter.age[0] && sampleProp.age <= appliedFilter.age[1]) {
        sampleProp.age = appliedFilter.age;
      }
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
