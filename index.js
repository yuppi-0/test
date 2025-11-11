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

    // Looker用のデータかどうかで分ける
    const isLooker = data && data.tables && data.tables.DEFAULT;

    let labels, datasets, style;
    if (isLooker) {
      const rows = data.tables.DEFAULT;
      labels = rows.map((r) => r.dimension[0]);
      const metricFields = data.fields.metrics;

      datasets = metricFields.map((mf, idx) => {
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

      style = data.style || {};
    } else {
      // ブラウザ単体で開いたときのダミー
      labels = ["採用貢献度", "応募者満足度", "関係構築力", "ヒアリング力", "魅力づけ力"];
      datasets = [
        {
          label: "あなた",
          data: [1.2, 2.5, 2.0, 3.0, 2.8],
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.15)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointBackgroundColor: "rgba(54, 162, 235, 1)"
        },
        {
          label: "社内平均",
          data: [2.1, 2.0, 3.0, 1.5, 1.8],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.15)",
          borderColor: "rgba(75, 192, 192, 1)",
          pointBackgroundColor: "rgba(75, 192, 192, 1)"
        }
      ];
      style = { showLegend: true, min: 0, max: 4 };
    }

    const showLegend = style.showLegend ?? true;
    const min = typeof style.min === "number" ? style.min : 0;
    const max = typeof style.max === "number" ? style.max : 4;

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

  // Lookerのdsccがあるなら購読、なければダミー描画
  if (typeof dscc !== "undefined") {
    dscc.subscribeToData(draw, { transform: dscc.objectTransform });
  } else {
    draw(); // ブラウザで直接開いたとき
  }
})();
