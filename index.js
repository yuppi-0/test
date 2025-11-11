(function () {
  function draw(data) {
    // コンテナ準備
    let container = document.getElementById("chart-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "chart-container";
      document.body.appendChild(container);
    }
    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.id = "chart";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Lookerからのデータかどうか
    const isLooker = data && data.tables && data.tables.DEFAULT;
    if (!isLooker) return; // データがない場合は描画しない

    const rows = data.tables.DEFAULT;
    const metricFields = data.fields.metrics;
    const labels = rows.map((r) => r.dimension[0]);

    const datasets = metricFields.map((mf, idx) => {
      const hue = (idx * 140) % 360;
      return {
        label: mf.name,
        data: rows.map((r) => r.metrics[idx]),
        fill: true,
        backgroundColor: `hsla(${hue}, 70%, 50%, 0.15)`,
        borderColor: `hsla(${hue}, 70%, 50%, 1)`,
        pointBackgroundColor: `hsla(${hue}, 70%, 50%, 1)`
      };
    });

    // スタイルの取得
    const style = data.style || {};
    const showLegend =
      style.showLegend && typeof style.showLegend.value === "boolean"
        ? style.showLegend.value
        : true;
    const min =
      style.min && typeof style.min.value === "number" ? style.min.value : 0;
    const max =
      style.max && typeof style.max.value === "number" ? style.max.value : 4;

    new Chart(ctx, {
      type: "radar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: showLegend }
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: min,
            suggestedMax: max
          }
        }
      }
    });
  }

  // Looker Studio から来ているとき
  if (typeof dscc !== "undefined") {
    dscc.subscribeToData(draw, { transform: dscc.objectTransform });
  }
})();
