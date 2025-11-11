// Looker Studio からデータを受け取って描画する処理
const dscc = require('dscc'); // Looker Studio からデータ購読するためのライブラリ

function drawViz(data) {
  const ctx = document.getElementById('chart').getContext('2d');

  // LookerからのデータをChart.js形式に変換
  const labels = data.fields.metrics.map(m => m.name);
  const datasets = data.tables.DEFAULT.map((row, i) => ({
    label: row.dimension[0],
    data: row.metrics,
    fill: true
  }));

  new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: data.style.showLegend }
      },
      scales: {
        r: {
          suggestedMin: data.style.scaleMin,
          suggestedMax: data.style.scaleMax
        }
      }
    }
  });
}

// Looker Studio からデータ購読
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
