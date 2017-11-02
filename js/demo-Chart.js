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
var chartColorArr = [
  chartColors.red,
  chartColors.blue,
  chartColors.orange,
  chartColors.purple
];
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
var data = {
  labels: [],
  datasets: []
};
var option = {
  responsive: false,
  maintainAspectRatio: false,
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

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: option
});

function read_inputs() {
  var opts = { yCols: [] };
  $('#durectives').val().split(/[\s,]+/).forEach(function(d) {
    if (d.indexOf('=')<0) {
      opts[d] = true;
      return;
    }
    var dd = d.split("=");
    if (dd[0] === 'y') opts.yCols.push(dd[1]);
    else opts[dd[0]] = dd[1];
  });
  opts.xCol = opts.x;
  opts.rows = $('#raw_data').val().split("\n");
  return opts;
}

function new_arr(n) {
  var arr = [];
  for (var i=0; i<n; i++) arr.push(0);
  return arr;
}

function data_changed() {
  var opts = read_inputs();
  if (opts.rows.length <= 0) return;

  data.labels = [];
  data.datasets = [];

  // Headings
  if (true) {
    var colorIdx = 0;
    var cols = opts.rows.shift().split(/\s+/);
    opts.yCols.forEach(function(yCol) {
      data.datasets.push(bar_dataset(
        cols[yCol], chartColorArr[colorIdx++], []
      ));
    });
  }

  var keys_n_rows = [];

  if (true) {
    var data_map = {};
    for (var i = 0; i < opts.rows.length; i++) {
      var cols = opts.rows[i].split(/\s+/);
      var key = opts.consolidate ? cols[opts.xCol] : i;
      if (!data_map[key]) {
        data_map[key] = new_arr(opts.yCols.length);
        keys_n_rows.push([cols[opts.xCol], data_map[key]]);
      }
      //console.dir(opts.yCols);
      for (var j = 0; j < opts.yCols.length; j++) {
        data_map[key][j] += parseInt(cols[opts.yCols[j]]);
      }
    }
  }

  //console.dir(map);
  console.dir(keys_n_rows);
  if (opts.sort) keys_n_rows.sort(function(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  // Render
  keys_n_rows.forEach(function(key_n_row) {
    data.labels.push(key_n_row[0]);
    var j = 0;
    key_n_row[1].map(function(val) {
      data.datasets[j++].data.push(val);
    });
  });
  console.dir(data.labels);
  myChart.update();
}

function change_type(newtype) {
  myChart.destroy();
  myChart = new Chart(ctx, {
    type: newtype,
    data: data,
    options: option
  });
}

data_changed();
