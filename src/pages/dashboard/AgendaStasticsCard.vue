<template>
  <div class="card">
    <div class="card-header pb-0 card-no-border">
      <div class="header-top">
        <h4>Agenda Trending</h4>
        <div class="dropdown icon-dropdown">
          <button
            class="btn dropdown-toggle"
            id="agendaTrendDropdown"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="icon-more-alt"></i>
          </button>
          <div
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="agendaTrendDropdown"
          >
            <a class="dropdown-item" href="#" @click.prevent="fetchData"
              >Refresh Data</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div v-if="!series[0].data.length" class="text-center py-5">
        <div class="mb-3">
          <i class="fa fa-bar-chart text-muted f-30"></i>
        </div>
        <p class="text-muted">Belum ada data partisipasi agenda.</p>
      </div>

      <div v-else class="chart-container">
        <div id="chart">
          <apexchart
            type="bar"
            height="320"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";

export default {
  name: "AgendaStatisticsCard",
  data() {
    return {
      series: [
        {
          name: "Peserta",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 320,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
            barHeight: "50%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#fff"],
          },
          formatter: function (val, opt) {
            return val + " Peserta";
          },
          offsetX: 0,
        },
        colors: ["#7366ff", "#51bb25", "#f73164", "#f8d62b", "#a927f9"],
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
            },
          },
        },
        yaxis: {
          labels: {
            maxWidth: 200,
            style: {
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            },
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 10,
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          theme: "light",
          y: {
            formatter: function (val) {
              return val + " Peserta";
            },
          },
        },
      },
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await getEventUsers({ per_page: 100 });
        this.processData(response);
      } catch (error) {
        console.error("Error fetching trending agendas:", error);
      }
    },
    processData(response) {
      if (!response || !response.data) {
        this.series = [{ name: "Peserta", data: [] }];
        return;
      }

      let data = [];
      if (Array.isArray(response.data)) {
        if (
          response.data.length > 0 &&
          response.data[0].data &&
          Array.isArray(response.data[0].data)
        ) {
          data = response.data[0].data;
        } else {
          data = response.data;
        }
      } else if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }

      const agendaCounts = {};
      data.forEach((entry) => {
        if (entry.id_agenda && entry.events) {
          const id = entry.id_agenda;
          if (!agendaCounts[id]) {
            agendaCounts[id] = {
              id: id,
              title: entry.events.judul || "Agenda Tanpa Judul",
              count: 0,
            };
          }
          agendaCounts[id].count++;
        }
      });

      let sortedAgendas = Object.values(agendaCounts).sort(
        (a, b) => b.count - a.count
      );
      sortedAgendas = sortedAgendas.slice(0, 5);

      if (sortedAgendas.length > 0) {
        this.series = [
          {
            name: "Peserta",
            data: sortedAgendas.map((item) => item.count),
          },
        ];

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: sortedAgendas.map((item) => item.title),
          },
        };
      } else {
        this.series = [{ name: "Peserta", data: [] }];
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: { ...this.chartOptions.xaxis, categories: [] },
        };
      }
    },
  },
};
</script>

<style scoped>
.f-30 {
  font-size: 30px;
}
</style>
