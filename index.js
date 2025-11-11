// Looker Studioのデータ購読用ライブラリを使う想定
// 実運用だと https://developers.google.com/looker-studio/visualization/library で読み込みますが
// ここでは最小イメージです。

function drawChart(data) {
  const container = document.getElementById('chart-container');
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');

  // --- LookerからのオブジェクトをChart.js向けに変換する想定 ---
  // 今はダミーで表示しておく
  const labels = ['価格', '品質', 'サポート', 'デザイン', '速度'];
  const datasets = [
    {
      label: 'サンプル',
      data: [4, 5, 3, 5, 4],
      fill: true
    }
  ];

  new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// とりあえず即時に描画しておく（後でdscc.subscribeToDataに差し替える）
window.addEventListener('load', () => {
  drawChart();
});
