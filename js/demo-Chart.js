// https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.min.js
var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
var chartColorArr = [chartColors.red, chartColors.blue, chartColors.green, chartColors.yellow];
var color = Chart.helpers.color;

function bar_dataset(dsLabel, chartColor, dataArr) {
  return {
    label: dsLabel,
    backgroundColor: color(chartColor).alpha(0.5).rgbString(),
    borderColor: chartColor,
    borderWidth: 1,
    data: dataArr
  };
}
var canvas = document.getElementById('myChart');
var data = { labels: [], datasets: [] };
var option = {
  scales: {
    yAxes: [{
      stacked: false,
      gridLines: {
        display: true,
        color: "rgba(255,99,132,0.2)"
      }
    }],
    xAxes: [{
      gridLines: {
        display: false
      }
    }]
  }
};

var myBarChart = Chart.Bar(canvas, {
  data: data,
  options: option
});

function data_changed() {
  var xCol = 1,
    yCols = [],
    groupbyCol;
  $('#durectives').val().split(/[\s,]+/).forEach(function(d) {
    var dd = d.split("=");
    if (dd[0] === 'x') xCol = dd[1];
    else if (dd[0] === 'y') yCols.push(dd[1]);
    else if (dd[0] === 'groupby') groupbyCol = dd[1];
  });
  var rows = $('#raw_data').val().split("\n");
  if (rows.length > 0) {
    data.labels = [];
    data.datasets = [];
  }
  if (groupbyCol) {
    // consolidate data
  }
  var colorIdx = 0;
  for (var ii = 0; ii < rows.length; ii++) {
    var cols = rows[ii].split(/\s+/);
    if (ii > 0) data.labels.push(cols[xCol]);
    for (var j = 0; j < yCols.length; j++) {
      if (ii === 0) {
        data.datasets.push(bar_dataset(
          cols[yCols[j]], chartColorArr[colorIdx++], []
        ));
      } else {
        data.datasets[j].data.push(cols[yCols[j]]);
      }
    }
  };
  console.dir(data.labels);
  myBarChart.update();
}
data_changed();
