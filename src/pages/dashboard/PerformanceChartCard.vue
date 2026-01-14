<template>
  <div class="card">
    <div class="card-header pb-0 card-no-border">
      <div class="header-top">
        <div>
          <h5 class="mb-1">Tren Pendaftaran Agenda</h5>
          <span class="f-light f-12">Data {{ periodLabel }}</span>
        </div>
        <div class="dropdown icon-dropdown">
          <button
            class="btn dropdown-toggle"
            id="performanceChartDropdown"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="icon-more-alt"></i>
          </button>
          <div
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="performanceChartDropdown"
          >
            <a
              class="dropdown-item"
              href="#"
              :class="{ active: period === 'week' }"
              @click.prevent="changePeriod('week')"
            >
              7 Hari Terakhir
            </a>
            <a
              class="dropdown-item"
              href="#"
              :class="{ active: period === 'month' }"
              @click.prevent="changePeriod('month')"
            >
              30 Hari Terakhir
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" @click.prevent="fetchData">
              <i class="fa fa-refresh me-2"></i>Refresh Data
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Summary Stats -->
      <div class="row mb-4">
        <div class="col-4 text-center">
          <h4 class="mb-0 text-primary">{{ totalRegistrations }}</h4>
          <span class="f-light f-12">Total Pendaftaran</span>
        </div>
        <div class="col-4 text-center border-start border-end">
          <h4 class="mb-0 text-success">{{ totalAccepted }}</h4>
          <span class="f-light f-12">Diterima</span>
        </div>
        <div class="col-4 text-center">
          <h4 class="mb-0 text-danger">{{ totalRejected }}</h4>
          <span class="f-light f-12">Ditolak</span>
        </div>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading">
        <BaseSkeleton
          variant="custom"
          width="100%"
          height="280px"
          rounded="8px"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!hasData" class="text-center py-5">
        <div class="mb-3">
          <i class="fa fa-line-chart text-muted f-30"></i>
        </div>
        <p class="text-muted">Belum ada data pendaftaran.</p>
      </div>

      <!-- Chart -->
      <div v-else class="chart-container">
        <apexchart
          type="area"
          height="280"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";
import BaseSkeleton from "@/components/base/default/SkeletonLoader/BaseSkeleton.vue";
import {
  STATUS_TERDAFTAR_ID,
  STATUS_DITERIMA_ID,
  STATUS_DITOLAK_ID,
} from "@/constants/agendaStatus";

export default {
  name: "PerformanceChartCard",
  components: {
    BaseSkeleton,
  },
  data() {
    return {
      loading: false,
      period: "week",
      rawData: [],
      totalRegistrations: 0,
      totalAccepted: 0,
      totalRejected: 0,
      series: [
        { name: "Pendaftaran", data: [] },
        { name: "Diterima", data: [] },
        { name: "Ditolak", data: [] },
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 280,
          toolbar: { show: false },
          zoom: { enabled: false },
          fontFamily: "Inter, sans-serif",
        },
        dataLabels: { enabled: false },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        colors: ["#7366ff", "#51bb25", "#f73164"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "11px",
              fontFamily: "Inter, sans-serif",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "11px",
              fontFamily: "Inter, sans-serif",
            },
            formatter: (val) => Math.floor(val),
          },
          min: 0,
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3,
          padding: { left: 10, right: 10 },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          fontSize: "12px",
          markers: { width: 8, height: 8, radius: 8 },
        },
        tooltip: {
          theme: "light",
          x: { show: true },
          y: {
            formatter: (val) => val + " orang",
          },
        },
      },
    };
  },
  computed: {
    periodLabel() {
      return this.period === "week" ? "7 hari terakhir" : "30 hari terakhir";
    },
    hasData() {
      return (
        this.series[0].data.length > 0 && this.series[0].data.some((v) => v > 0)
      );
    },
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async changePeriod(newPeriod) {
      if (this.period !== newPeriod) {
        this.period = newPeriod;
        await this.fetchData();
      }
    },
    async fetchData() {
      this.loading = true;
      try {
        const response = await getEventUsers({ per_page: 500 });
        this.processData(response);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        this.loading = false;
      }
    },
    processData(response) {
      if (!response || !response.data) {
        this.resetData();
        return;
      }

      // Extract data array
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

      this.rawData = data;

      // Calculate date range
      const days = this.period === "week" ? 7 : 30;
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);

      // Initialize daily counts
      const dailyData = {};
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const key = this.formatDateKey(date);
        dailyData[key] = {
          label: this.formatDateLabel(date),
          registered: 0,
          accepted: 0,
          rejected: 0,
        };
      }

      // Count registrations by date and status
      let totalReg = 0;
      let totalAcc = 0;
      let totalRej = 0;

      data.forEach((entry) => {
        if (!entry.created_at) return;

        const entryDate = new Date(entry.created_at);
        if (entryDate < startDate || entryDate > today) return;

        const key = this.formatDateKey(entryDate);
        if (!dailyData[key]) return;

        const statusId = entry.id_status;

        // Count by status
        if (statusId === STATUS_DITERIMA_ID) {
          dailyData[key].accepted++;
          totalAcc++;
        } else if (statusId === STATUS_DITOLAK_ID) {
          dailyData[key].rejected++;
          totalRej++;
        } else {
          dailyData[key].registered++;
          totalReg++;
        }
      });

      // Update totals
      this.totalRegistrations = totalReg + totalAcc + totalRej;
      this.totalAccepted = totalAcc;
      this.totalRejected = totalRej;

      // Prepare chart data
      const categories = [];
      const registeredData = [];
      const acceptedData = [];
      const rejectedData = [];

      Object.keys(dailyData)
        .sort()
        .forEach((key) => {
          const day = dailyData[key];
          categories.push(day.label);
          registeredData.push(day.registered);
          acceptedData.push(day.accepted);
          rejectedData.push(day.rejected);
        });

      this.series = [
        { name: "Pendaftaran", data: registeredData },
        { name: "Diterima", data: acceptedData },
        { name: "Ditolak", data: rejectedData },
      ];

      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: categories,
        },
      };
    },
    formatDateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDateLabel(date) {
      if (this.period === "week") {
        return date.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
        });
      }
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    },
    resetData() {
      this.series = [
        { name: "Pendaftaran", data: [] },
        { name: "Diterima", data: [] },
        { name: "Ditolak", data: [] },
      ];
      this.totalRegistrations = 0;
      this.totalAccepted = 0;
      this.totalRejected = 0;
    },
  },
};
</script>

<style scoped>
.f-12 {
  font-size: 12px;
}
.f-30 {
  font-size: 30px;
}
.dropdown-item.active {
  background-color: rgba(115, 102, 255, 0.1);
  color: #7366ff;
}
.border-start {
  border-left: 1px solid #e9ecef !important;
}
.border-end {
  border-right: 1px solid #e9ecef !important;
}
</style>
