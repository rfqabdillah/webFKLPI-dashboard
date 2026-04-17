<template>
  <div class="card statistik-card border-0">
    <div
      class="card-header d-flex align-items-center justify-content-between pb-0 border-0"
    >
      <div>
        <h6 class="stat-card-title mb-1">Statistik Pendaftaran Perusahaan</h6>
      </div>
      <div class="filter-pills">
        <button
          v-for="filter in filters"
          :key="filter.key"
          class="filter-pill"
          :class="{ active: activeFilter === filter.key }"
          @click="changeFilter(filter.key)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="card-body pt-2">
      <div v-if="isLoading" class="chart-skeleton">
        <div
          class="skeleton-bar"
          v-for="n in 7"
          :key="n"
          :style="{ height: 30 + Math.random() * 50 + '%' }"
        />
      </div>
      <apexchart
        v-else
        type="bar"
        height="280"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { getPerusahaan } from "@/services/general/organisasi/perusahaan";

export default {
  name: "StatistikPerusahaanCard",
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      isLoading: true,
      activeFilter: "7d",
      allData: [],
      totalCount: 0,

      filters: [
        { key: "7d", label: "7 Hari" },
        { key: "30d", label: "30 Hari" },
        { key: "12m", label: "12 Bulan" },
      ],

      chartSeries: [
        {
          name: "Pendaftaran",
          data: [],
        },
      ],

      chartOptions: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          fontFamily: "inherit",
          sparkline: { enabled: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "55%",
            distributed: false,
          },
        },
        colors: ["#7366ff"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.2,
            opacityFrom: 1,
            opacityTo: 0.85,
            stops: [0, 100],
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: "#8d8d8d",
              fontSize: "11px",
            },
            rotate: -45,
            rotateAlways: false,
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          decimalsInFloat: 0,
          labels: {
            style: {
              colors: "#8d8d8d",
              fontSize: "11px",
            },
            formatter: (v) => Math.round(v),
          },
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
        },
        tooltip: {
          theme: "light",
          y: {
            formatter: (v) => `${v} perusahaan`,
          },
        },
        states: {
          hover: { filter: { type: "darken", value: 0.85 } },
          active: { filter: { type: "none" } },
        },
      },
    };
  },

  async mounted() {
    await this.fetchData();
  },

  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        const res = await getPerusahaan();
        let payload = res?.data;

        if (
          Array.isArray(payload) &&
          payload.length > 0 &&
          (payload[0].data || payload[0].meta)
        ) {
          payload = payload[0];
        }

        this.allData = Array.isArray(payload?.data) ? payload.data : [];
        this.totalCount =
          payload?.meta?.pagination?.total ??
          payload?.total ??
          this.allData.length;

        this.processChart();
      } catch (err) {
        console.error("StatistikPerusahaanCard: gagal memuat data:", err);
        this.allData = [];
        this.processChart();
      } finally {
        this.isLoading = false;
      }
    },

    changeFilter(key) {
      this.activeFilter = key;
      this.processChart();
    },

    processChart() {
      const now = new Date();

      if (this.activeFilter === "12m") {
        this.processMonthly(now);
      } else {
        const days = this.activeFilter === "7d" ? 7 : 30;
        this.processDaily(now, days);
      }
    },

    processDaily(now, days) {
      const buckets = {};
      const labels = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = this.formatDateKey(d);
        const label =
          days <= 7
            ? d.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
              })
            : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        buckets[key] = 0;
        labels.push(label);
      }

      this.allData.forEach((item) => {
        const dateStr = item.created_at;
        if (!dateStr) return;
        const parsed = new Date(dateStr);
        if (isNaN(parsed)) return;
        const key = this.formatDateKey(parsed);
        if (key in buckets) {
          buckets[key]++;
        }
      });

      this.updateChart(labels, Object.values(buckets));
    },

    processMonthly(now) {
      const buckets = {};
      const labels = [];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agt",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0",
        )}`;
        buckets[key] = 0;
        labels.push(
          `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        );
      }

      this.allData.forEach((item) => {
        const dateStr = item.created_at;
        if (!dateStr) return;
        const parsed = new Date(dateStr);
        if (isNaN(parsed)) return;
        const key = `${parsed.getFullYear()}-${String(
          parsed.getMonth() + 1,
        ).padStart(2, "0")}`;
        if (key in buckets) {
          buckets[key]++;
        }
      });

      this.updateChart(labels, Object.values(buckets));
    },

    updateChart(labels, data) {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: labels,
        },
      };
      this.chartSeries = [{ name: "Pendaftaran", data }];
    },

    formatDateKey(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(d.getDate()).padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped>
.statistik-card {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  background: transparent;
  padding: 20px 20px 0;
}

.stat-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--body-font-color, #2b2b2b);
}

.stat-card-subtitle {
  font-size: 12.5px;
  color: var(--light-font, #8d8d8d);
}

/* Filter pills */
.filter-pills {
  display: flex;
  gap: 4px;
  background: #f4f4f8;
  border-radius: 10px;
  padding: 3px;
}

.filter-pill {
  border: none;
  background: transparent;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #8d8d8d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  color: var(--body-font-color, #2b2b2b);
}

.filter-pill.active {
  background: var(--theme-deafult, #7366ff);
  color: #fff;
  box-shadow: 0 2px 8px rgba(115, 102, 255, 0.35);
}

/* Loading skeleton */
.chart-skeleton {
  height: 280px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 20px 0;
}

.skeleton-bar {
  flex: 1;
  background: linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%);
  border-radius: 6px 6px 0 0;
  animation: skeletonPulse 1.4s ease-in-out infinite;
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 576px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
}
</style>
