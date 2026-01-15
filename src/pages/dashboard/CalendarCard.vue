<template>
  <div class="card">
    <div class="card-header pb-0">
      <h5 class="mb-3 f-w-600">Kalender Agenda</h5>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div
            class="month-selector border rounded px-3 py-1 d-flex align-items-center me-2"
            style="
              background-color: #f5f6f9;
              cursor: pointer;
              position: relative;
              min-width: 140px;
            "
          >
            <div
              class="d-flex align-items-center justify-content-between w-100"
            >
              <span class="fw-bold f-14 text-dark">{{
                months[selectedMonth]
              }}</span>
              <i class="fa fa-angle-down f-12 text-muted"></i>
            </div>
            <select
              class="form-select border-0 shadow-none p-0"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
                z-index: 10;
              "
              v-model="selectedMonth"
            >
              <option
                v-for="(month, index) in months"
                :key="index"
                :value="index"
              >
                {{ month }}
              </option>
            </select>
          </div>

          <span class="fw-bold f-16 text-muted">{{ currentYear }}</span>
        </div>

        <div class="calendar-nav">
          <button class="btn btn-sm" @click="prevMonth">
            <i class="fa fa-chevron-left text-muted"></i>
          </button>
          <button class="btn btn-sm" @click="nextMonth">
            <i class="fa fa-chevron-right text-muted"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <!-- Calendar Grid -->
      <div class="calendar-container mb-4">
        <div class="week-days d-flex justify-content-between mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-muted f-w-500"
            style="width: 14.28%"
          >
            {{ day }}
          </div>
        </div>
        <div class="days-grid d-flex flex-wrap">
          <!-- Empty cells for start padding -->
          <div
            v-for="n in startPadding"
            :key="'pad-' + n"
            style="width: 14.28%; height: 40px"
          ></div>

          <!-- Actual days -->
          <div
            v-for="day in daysInMonth"
            :key="day"
            class="day-cell d-flex justify-content-center align-items-center"
            style="width: 14.28%; height: 40px"
          >
            <button class="btn-day" :class="{ active: isToday(day) }">
              {{ day }}
              <div class="dots-container" v-if="getEventsForDay(day).length">
                <span
                  v-for="(event, i) in getEventsForDay(day)"
                  :key="i"
                  class="event-dot"
                  :class="getDotClass(event)"
                  :title="event.judul"
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <hr class="mb-4" />

      <!-- Reminders Section -->
      <div class="reminders-section">
        <h6 class="mb-3 f-w-600">Pengingat</h6>

        <div
          v-if="filteredEvents.length > 0"
          class="reminder-list"
          style="max-height: 300px; overflow-y: auto; padding-right: 5px"
        >
          <div
            v-for="(event, index) in filteredEvents"
            :key="event.idagenda"
            class="reminder-item d-flex align-items-start mb-3"
          >
            <div
              class="reminder-icon me-3 text-center flex-shrink-0"
              :class="getIconClass(index)"
            >
              <i
                class="fa fa-calendar-check-o"
                :class="getTextClass(index)"
              ></i>
            </div>
            <div>
              <h6 class="mb-1 f-w-600 f-14 text-truncate-2">
                {{ event.judul }}
              </h6>
              <div class="d-flex flex-column gap-1">
                <p class="text-muted f-12 mb-0">
                  <i class="fa fa-clock-o me-1"></i> Pelaksanaan:
                  {{ formatDate(event.tglpelaksanaan) }}
                </p>
                <p class="text-danger f-12 mb-0">
                  <i class="fa fa-exclamation-circle me-1"></i> Batas:
                  {{ formatDate(event.tglbatasdaftar) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-3">
          <p class="text-muted f-12">Tidak ada agenda pada bulan ini</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEvents } from "@/services/general/events/events";
import { formatDate } from "@/utils/formatDate";

export default {
  data() {
    return {
      displayDate: new Date(),
      weekDays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      months: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      events: [],
    };
  },
  computed: {
    currentYear() {
      return this.displayDate.getFullYear();
    },
    selectedMonth: {
      get() {
        return this.displayDate.getMonth();
      },
      set(val) {
        this.displayDate = new Date(this.displayDate.getFullYear(), val, 1);
      },
    },
    daysInMonth() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      return new Date(year, month + 1, 0).getDate();
    },
    startPadding() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      return firstDay;
    },
    filteredEvents() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      return this.events.filter((event) => {
        const eventDate = new Date(event.tglpelaksanaan);
        return (
          eventDate.getFullYear() === year && eventDate.getMonth() === month
        );
      });
    },
  },
  mounted() {
    this.fetchAgenda();
  },
  methods: {
    async fetchAgenda() {
      try {
        const response = await getEvents();
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.events = response.data[0].data || [];
        } else if (response.data && response.data.data) {
          this.events = response.data.data;
        }
      } catch (error) {
        console.error("Failed to fetch agenda:", error);
      }
    },
    formatDate(date) {
      return formatDate(date, "id");
    },
    getIconClass(index) {
      const styles = [
        "bg-light-primary",
        "bg-light-secondary",
        "bg-light-warning",
        "bg-light-info",
      ];
      return styles[index % styles.length];
    },
    getTextClass(index) {
      const styles = [
        "text-primary",
        "text-secondary",
        "text-warning",
        "text-info",
      ];
      return styles[index % styles.length];
    },
    getEventsForDay(day) {
      return this.filteredEvents.filter((event) => {
        const eventDate = new Date(event.tglpelaksanaan);
        return eventDate.getDate() === day;
      });
    },
    getDotClass(event) {
      const index = this.filteredEvents.findIndex(
        (e) => e.idagenda === event.idagenda
      );
      if (index === -1) return "";
      const styles = ["bg-primary", "bg-secondary", "bg-warning", "bg-info"];
      return styles[index % styles.length];
    },
    prevMonth() {
      this.displayDate = new Date(
        this.displayDate.getFullYear(),
        this.displayDate.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.displayDate = new Date(
        this.displayDate.getFullYear(),
        this.displayDate.getMonth() + 1,
        1
      );
    },
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.displayDate.getMonth() === today.getMonth() &&
        this.displayDate.getFullYear() === today.getFullYear()
      );
    },
    hasEvent(day) {
      return this.filteredEvents.some((event) => {
        const eventDate = new Date(event.tglpelaksanaan);
        return eventDate.getDate() === day;
      });
    },
  },
};
</script>

<style scoped>
.btn-day {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #2c323f;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  flex-direction: column;
}

.btn-day:hover {
  background-color: #f0f0f0;
}

.btn-day.active {
  background-color: #7366ff;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(115, 102, 255, 0.4);
}

.dots-container {
  position: absolute;
  bottom: 2px;
  display: flex;
  justify-content: center;
  gap: 2px;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.event-dot:hover {
  transform: scale(1.4);
  z-index: 2;
}

.bg-primary {
  background-color: #7366ff !important;
}
.bg-secondary {
  background-color: #f73164 !important;
}
.bg-warning {
  background-color: #ff9f43 !important;
}
.bg-info {
  background-color: #00cfe8 !important;
}

.reminder-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  line-height: 40px;
}

.bg-light-primary {
  background-color: rgba(115, 102, 255, 0.1) !important;
}
.text-primary {
  color: #7366ff !important;
}
</style>
