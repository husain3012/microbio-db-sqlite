var ctx = document.getElementById("myChart").getContext("2d");
var antibiogramChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Antibiotics"],
    datasets: [
      {
        label: "Bacteria",
        data: [0],

        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

$("#antibiogram-form").on("submit", function (e) {
  e.preventDefault();
  $(`#loader`).addClass("active");
  clearChart(antibiogramChart);
  let bacterias = $(this).find("input[name=bacteria]").val().split(", ");

  let startDate = $(this).find("input[name=startDate]").val();
  let endDate = $(this).find("input[name=endDate]").val();
  startDate ? (startDate = new Date(startDate)) : null;
  endDate ? (endDate = new Date(endDate)) : null;
  bacterias.forEach((bacteria, index) => {
    axios.post(`${window.location.origin}/api/antibiogram/bacteria`, { bacteria, startDate, endDate }).then((response) => {
      $(`#loader`).removeClass("active");
      console.log(response.data);
      let data = [];
      let labels = [];
      for (const [key, value] of Object.entries(response.data)) {
        if (value.total > 10) {
          data.push((value.sus / value.total) * 100);
          labels.push(key);
        }
      }

      refreshChart(antibiogramChart, labels, data, bacteria, index);
    });
  });
});

function refreshChart(chart, labels, data, bacteria, i) {
  chart.data.labels = labels;
  chart.data.datasets[i] = {
    data: [...data],
    label: bacteria,
    backgroundColor: [randomRGBA(0.5)],
    borderColor: [randomRGBA(1)],
  };
  chart.update();
}

function clearChart(chart) {
  chart.data.labels = [];
  chart.data.datasets = [
    {
      label: "Bacteria",
      data: [0],

      borderWidth: 1,
    },
  ];
  chart.update();
}

function randomRGBA(opacity = 1) {
  return `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 255)}, ${opacity})`;
}
