document.addEventListener('DOMContentLoaded', () => {
    const initialAmountInput = document.getElementById('initialAmount');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const investmentPeriodInput = document.getElementById('investmentPeriod');
    const annualReturnInput = document.getElementById('annualReturn');
    const totalInvestedSpan = document.getElementById('totalInvested');
    const finalValueSpan = document.getElementById('finalValue');
    const profitSpan = document.getElementById('profit');
    const percentageGainSpan = document.getElementById('percentageGain');
    const ctx = document.getElementById('capitalizationChart').getContext('2d');
    const shareBtn = document.getElementById('shareBtn');

    let capitalizationChart;

    const calculateCapitalization = () => {
        console.log('calculateCapitalization called');
        const initialAmount = parseFloat(initialAmountInput.value);
        const monthlyContribution = parseFloat(monthlyContributionInput.value);
        const investmentPeriod = parseInt(investmentPeriodInput.value);
        const annualReturn = parseFloat(annualReturnInput.value) / 100;

        let totalInvested = initialAmount;
        let currentCapital = initialAmount;
        const chartLabels = [];
        const chartData = [];

        chartLabels.push('Rok 0');
        chartData.push(initialAmount);

        for (let year = 1; year <= investmentPeriod; year++) {
            // Dodajemy miesięczne dopłaty za dany rok
            totalInvested += monthlyContribution * 12;
            currentCapital += monthlyContribution * 12;

            // Kapitalizacja roczna
            currentCapital *= (1 + annualReturn);

            chartLabels.push(`Rok ${year}`);
            chartData.push(currentCapital);
        }

        const finalValue = currentCapital;
        const profit = finalValue - totalInvested;
        const percentageGain = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

        totalInvestedSpan.innerHTML = totalInvested.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;<span class="suffix">PLN</span>';
        finalValueSpan.innerHTML = finalValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;<span class="suffix">PLN</span>';
        profitSpan.innerHTML = (profit >= 0 ? '+' : '') + profit.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;<span class="suffix">PLN</span>';
        percentageGainSpan.innerHTML = (percentageGain >= 0 ? '+' : '') + percentageGain.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;<span class="suffix">%</span>';

        updateChart(chartLabels, chartData);
    };

    const updateChart = (labels, data) => {
        console.log('updateChart called');
        if (capitalizationChart) {
            // Update existing chart
            capitalizationChart.data.labels = labels;
            capitalizationChart.data.datasets[0].data = data;
            capitalizationChart.update();
        } else {
            // Create new chart
            capitalizationChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Wartość kapitału (PLN)',
                        data: data,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                color: '#444',
                                borderColor: '#555'
                            },
                            ticks: {
                                color: '#e0e0e0'
                            }
                        },
                        y: {
                            grid: {
                                color: '#444',
                                borderColor: '#555'
                            },
                            ticks: {
                                color: '#e0e0e0'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e0e0e0'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#3a3a3a',
                            titleColor: '#4CAF50',
                            bodyColor: '#e0e0e0',
                            borderColor: '#4CAF50',
                            borderWidth: 1
                        }
                    }
                }
            });
        }
    };

    function formatNumber(num) {
        return num.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function openShareView() {
        const initialAmount = parseFloat(initialAmountInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const investmentPeriod = parseInt(investmentPeriodInput.value) || 0;
        const annualReturnPct = parseFloat(annualReturnInput.value) || 0;

        // Przeliczenia końcowe jak w aktualnym stanie
        const labels = [];
        const data = [];
        let totalInvested = initialAmount;
        let currentCapital = initialAmount;
        labels.push('Rok 0');
        data.push(initialAmount);
        for (let year = 1; year <= investmentPeriod; year++) {
            totalInvested += monthlyContribution * 12;
            currentCapital += monthlyContribution * 12;
            currentCapital *= (1 + (annualReturnPct / 100));
            labels.push(`Rok ${year}`);
            data.push(currentCapital);
        }
        const finalValue = currentCapital;
        const profit = finalValue - totalInvested;
        const profitPercent = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

        const shareHtml = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Share — Podsumowanie inwestycji</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #0b0b0f; --panel: #14141a; --accent: #FFD700; --accent-2: #00C853; --text: #e7e7e7; --muted: #a0a0a8; }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body { margin:0; background: radial-gradient(1200px 800px at 20% -10%, rgba(255,215,0,0.08), transparent), linear-gradient(180deg, #0b0b0f 0%, #0f0f15 100%); color: var(--text); font-family: 'Roboto', system-ui, sans-serif; }
    .wrap { display:flex; align-items:center; justify-content:center; min-height:100%; padding: 24px; }
    .card { width: min(720px, 96vw); background: linear-gradient(180deg, rgba(255,215,0,0.06), rgba(0,200,83,0.06)), var(--panel); border-radius: 16px; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); }
    .hdr { display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 10px; }
    .brand { font-weight: 800; letter-spacing: 0.5px; color: var(--accent); }
    .tag { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(0,200,83,0.16); color: #7CFFB0; border: 1px solid rgba(0,200,83,0.3); }
    .subtop { color: var(--muted); margin: 6px 0 2px; font-size: 13px; letter-spacing: .2px; text-transform: none; }
    .headline { margin: 4px 0 2px; font-size: clamp(28px, 7vw, 44px); font-weight: 900; color: var(--accent); line-height: 1.12; }
    .headline-badge { display:inline-block; margin-left: 10px; font-size: clamp(14px, 3.5vw, 18px); font-weight: 900; color: #0f2616; background: linear-gradient(180deg, rgba(0,200,83,0.95), rgba(0,200,83,0.75)); border-radius: 999px; padding: 4px 10px; vertical-align: middle; }
    .headline-amount { white-space: nowrap; }
    .sub { color: var(--muted); margin-bottom: 14px; font-size: 14px; }
    .sub.sub-profit { font-size: clamp(14px, 3.5vw, 18px); font-weight: 800; color: var(--text); }
    .sub.sub-profit .profit { color: var(--accent-2); }
    .kpis { display:grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 18px; }
    .kpi { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px; }
    .kpi h4 { margin:0; font-size: 12px; color: var(--muted); font-weight: 500; }
    .kpi p { margin:4px 0 0; font-size: clamp(16px, 4vw, 22px); font-weight: 800; color: var(--text); }
    .profit { color: var(--accent-2); }
    .footer { margin-top: 18px; display:flex; justify-content:space-between; align-items:center; color: var(--muted); font-size: 12px; }
    @media (max-width: 560px) {
      .kpis { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="hdr">
          <div class="brand">Kalkulator Emerytury BTC</div>
          <div class="tag">Share</div>
        </div>
        <div class="subtop">Cel końcowy po ${investmentPeriod} latach</div>
        <div class="headline"><span class="headline-amount">${formatNumber(finalValue)} PLN</span> <span class="headline-badge">${profitPercent.toFixed(2)}%</span></div>
        <div class="sub sub-profit">Zysk: <span class="profit">${profit >= 0 ? '+' : ''}${formatNumber(profit)} PLN</span></div>
        <div class="kpis">
          <div class="kpi"><h4>Kwota startowa</h4><p>${formatNumber(initialAmount)} PLN</p></div>
          <div class="kpi"><h4>Zwrot roczny</h4><p>${annualReturnPct.toFixed(2)}%</p></div>
          <div class="kpi"><h4>Czas</h4><p>${investmentPeriod} lat</p></div>
          <div class="kpi"><h4>Wpłata miesięczna</h4><p>${formatNumber(monthlyContribution)} PLN</p></div>
        </div>
        <div class="footer"><span>Wygenerowano do udostępnienia</span><span>topciu • ${new Date().getFullYear()}</span></div>
      </div>
    </div>
  </body>
</html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.open();
            win.document.write(shareHtml);
            win.document.close();
        }
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', openShareView);
    }

    initialAmountInput.addEventListener('input', calculateCapitalization);
    monthlyContributionInput.addEventListener('input', calculateCapitalization);
    investmentPeriodInput.addEventListener('input', calculateCapitalization);
    annualReturnInput.addEventListener('input', calculateCapitalization);

    // Oblicz początkowe wartości przy ładowaniu strony
    calculateCapitalization();
});
