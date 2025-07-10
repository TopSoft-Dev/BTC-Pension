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

        totalInvestedSpan.innerHTML = '<br>' + totalInvested.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;&nbsp;<span class="suffix">PLN</span>';
        finalValueSpan.innerHTML = '<br>' + finalValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;&nbsp;<span class="suffix">PLN</span>';
        profitSpan.innerHTML = '<br>' + (profit >= 0 ? '+' : '') + profit.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;&nbsp;<span class="suffix">PLN</span>';
        percentageGainSpan.innerHTML = '<br>' + (percentageGain >= 0 ? '+' : '') + percentageGain.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '&nbsp;&nbsp;<span class="suffix">%</span>';

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

    initialAmountInput.addEventListener('input', calculateCapitalization);
    monthlyContributionInput.addEventListener('input', calculateCapitalization);
    investmentPeriodInput.addEventListener('input', calculateCapitalization);
    annualReturnInput.addEventListener('input', calculateCapitalization);

    // Oblicz początkowe wartości przy ładowaniu strony
    calculateCapitalization();
});
