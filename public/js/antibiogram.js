var ctx = document.getElementById("myChart").getContext("2d");
var antibiogramChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Susceptibility",
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
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
  const bacteria = $(this).find("input[name=bacteria]").val();
  let startDate = $(this).find("input[name=startDate]").val();
  let endDate = $(this).find("input[name=endDate]").val();
  startDate ? (startDate = new Date(startDate)) : null;
  endDate ? (endDate = new Date(endDate)) : null;

  axios.post(`${window.location.origin}/api/antibiogram/bacteria`, { bacteria, startDate, endDate }).then((response) => {
    console.log(response.data);
    let data = [];
    let labels = [];
    for (const [key, value] of Object.entries(response.data)) {
      if (value.total > 10) {
        data.push((value.sus / value.total) * 100);
        labels.push(key);
      }
    }
    refreshChart(antibiogramChart, labels, data);
  });
});

function refreshChart(chart, labels, data) {
  chart.data.labels = [...labels];
  chart.data.datasets[0].data = [...data];
  chart.update();
}
