import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {TripLabel, getMoneyStat} from "../utils/statistics.js";

const BAR_HEIGHT = 55;

class Statistics extends SmartView {
  constructor(trips) {
    super();
    this._trips = trips;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  _createStatisticsTemplate() {
    return `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
  }

  get _template() {
    return this._createStatisticsTemplate();
  }

  _renderChart(data, ctx, title, label) {
    ctx.height = BAR_HEIGHT * data.size;

    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(data).map((name) => TripLabel[name]),
        datasets: [{
          data: Object.values(data),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}${label}`
          }
        },
        title: {
          display: true,
          text: title,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`,
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{

            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null ||
        this._transportChart !== null ||
        this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.element.querySelector(`.statistics__chart--money`);
    const transportCtx = this.element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.element.querySelector(`.statistics__chart--time`);

    this._moneyChart = this._renderChart(getMoneyStat(this._trips), moneyCtx, `MONEY`, `€`);
    /*this._transportChart = this._renderChart(transportStat, transportCtx, `TRANSPORT`, `x`);
    this._timeSpendChart = this._renderChart(timeStat, timeSpendCtx, `TIME SPENT`, `H`);*/
  }
}

export default Statistics;
