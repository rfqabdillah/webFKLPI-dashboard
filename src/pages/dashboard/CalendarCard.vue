<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0 f-w-600">Kalender Agenda</h5>
        <button
          v-if="!isCurrentMonth"
          class="btn btn-sm btn-outline-primary rounded-pill px-3"
          @click="goToToday"
        >
          <i class="fa fa-calendar me-1"></i> Hari Ini
        </button>
      </div>
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
            <button
              class="btn-day"
              :class="{
                active: isToday(day),
                selected: selectedDay === day && !isToday(day),
                'past-day': isPastDay(day),
              }"
              @click="selectDay(day)"
            >
              {{ day }}
              <div class="dots-container" v-if="getEventsForDay(day).length">
                <span
                  v-for="(event, i) in getEventsForDay(day).slice(0, 3)"
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

      <hr class="mb-3" />

      <!-- Reminders Section -->
      <div class="reminders-section">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="mb-0 f-w-600">
            <template v-if="selectedDay">
              Agenda Tanggal {{ selectedDay }}
            </template>
            <template v-else>Agenda Mendatang</template>
          </h6>
          <button
            v-if="selectedDay"
            class="btn btn-sm text-muted p-0"
            title="Tampilkan semua"
            @click="clearSelectedDay"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div
          v-if="reminderEvents.length > 0"
          class="reminder-list"
          style="max-height: 300px; overflow-y: auto; padding-right: 5px"
        >
          <div
            v-for="(event, index) in reminderEvents"
            :key="event.id_agenda"
            class="reminder-item d-flex align-items-start mb-3"
            :class="{ 'past-event': isEventPast(event) }"
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
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <h6 class="mb-0 f-w-600 f-14 text-truncate-2">
                  {{ event.judul }}
                </h6>
              </div>
              <p
                v-if="event.fklpi && event.fklpi.nama_organisasi"
                class="text-muted f-12 mb-1"
              >
                <i class="fa fa-building me-1"></i>
                {{ event.fklpi.nama_organisasi }}
              </p>
              <div class="d-flex flex-column gap-1">
                <p class="text-muted f-12 mb-0">
                  <i class="fa fa-clock-o me-1"></i> Pelaksanaan:
                  {{ formatDate(event.tanggal_pelaksanaan) }}
                </p>
                <p v-if="event.tempat_pelaksanaan" class="text-muted f-12 mb-0">
                  <i class="fa fa-map-marker me-1"></i> Tempat:
                  {{ event.tempat_pelaksanaan }}
                </p>
                <p class="text-danger f-12 mb-0">
                  <i class="fa fa-exclamation-circle me-1"></i> Batas:
                  {{ formatDate(event.tanggal_batas_pendaftaran) }}
                </p>
              </div>
              <span
                v-if="isEventPast(event)"
                class="badge rounded-pill f-11 px-2 py-1 bg-light text-muted"
              >
                <i class="fa fa-check me-1"></i>Selesai
              </span>
              <template v-else>
                <span
                  class="badge rounded-pill f-11 px-2 py-1"
                  :class="
                    isRegistrationOpen(event)
                      ? 'bg-light-success text-success'
                      : 'bg-light-danger text-danger'
                  "
                >
                  <i
                    class="fa me-1"
                    :class="
                      isRegistrationOpen(event) ? 'fa-check-circle' : 'fa-ban'
                    "
                  ></i>
                  {{
                    isRegistrationOpen(event)
                      ? "Pendaftaran Dibuka"
                      : "Pendaftaran Ditutup"
                  }}
                </span>
                <span
                  v-if="daysUntilEvent(event) >= 0"
                  class="badge rounded-pill f-11 px-2 py-1"
                  :class="getCountdownClass(event)"
                >
                  <i class="fa fa-hourglass-half me-1"></i>
                  {{
                    daysUntilEvent(event) === 0
                      ? "Hari Ini!"
                      : "H-" + daysUntilEvent(event)
                  }}
                </span>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <i
            class="fa fa-calendar-o text-muted mb-2"
            style="font-size: 32px"
          ></i>
          <p class="text-muted f-12 mb-0">
            <template v-if="selectedDay">
              Tidak ada agenda pada tanggal ini
            </template>
            <template v-else> Tidak ada agenda bulan ini </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAgenda } from "@/services/general/agenda/agenda";
import { formatDate } from "@/utils/formatDate";

export default {
  data() {
    return {
      displayDate: new Date(),
      selectedDay: null,
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
        this.selectedDay = null;
      },
    },
    isCurrentMonth() {
      const today = new Date();
      return (
        this.displayDate.getMonth() === today.getMonth() &&
        this.displayDate.getFullYear() === today.getFullYear()
      );
    },
    daysInMonth() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      return new Date(year, month + 1, 0).getDate();
    },
    startPadding() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      return new Date(year, month, 1).getDay();
    },
    today() {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    },
    filteredEvents() {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      return this.events.filter((event) => {
        const eventDate = new Date(event.tanggal_pelaksanaan);
        return (
          eventDate.getFullYear() === year && eventDate.getMonth() === month
        );
      });
    },
    reminderEvents() {
      let list = [...this.filteredEvents];

      if (this.selectedDay) {
        list = list.filter((event) => {
          const eventDate = new Date(event.tanggal_pelaksanaan);
          return eventDate.getDate() === this.selectedDay;
        });
      }

      // Sort: upcoming first
      return list.sort((a, b) => {
        const dateA = new Date(a.tanggal_pelaksanaan);
        const dateB = new Date(b.tanggal_pelaksanaan);
        const isPastA = dateA < this.today;
        const isPastB = dateB < this.today;

        if (isPastA !== isPastB) return isPastA ? 1 : -1;
        return dateA - dateB;
      });
    },
  },
  mounted() {
    this.fetchAgenda();
  },
  methods: {
    async fetchAgenda() {
      try {
        const response = await getAgenda();
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
    selectDay(day) {
      this.selectedDay = this.selectedDay === day ? null : day;
    },
    clearSelectedDay() {
      this.selectedDay = null;
    },
    goToToday() {
      this.displayDate = new Date();
      this.selectedDay = null;
    },
    isRegistrationOpen(event) {
      if (!event.tanggal_batas_pendaftaran) return false;
      const deadline = new Date(event.tanggal_batas_pendaftaran);
      deadline.setHours(23, 59, 59, 999);
      return deadline >= this.today;
    },
    daysUntilEvent(event) {
      const eventDate = new Date(event.tanggal_pelaksanaan);
      eventDate.setHours(0, 0, 0, 0);
      const diffTime = eventDate - this.today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    getCountdownClass(event) {
      const days = this.daysUntilEvent(event);
      if (days <= 3) return "bg-light-danger text-danger";
      if (days <= 7) return "bg-light-warning text-warning";
      return "bg-light-info text-info";
    },
    isPastDay(day) {
      const cellDate = new Date(
        this.displayDate.getFullYear(),
        this.displayDate.getMonth(),
        day,
      );
      cellDate.setHours(0, 0, 0, 0);
      return cellDate < this.today;
    },
    isEventPast(event) {
      const eventDate = new Date(event.tanggal_pelaksanaan);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < this.today;
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
        const eventDate = new Date(event.tanggal_pelaksanaan);
        return eventDate.getDate() === day;
      });
    },
    getDotClass(event) {
      const index = this.filteredEvents.findIndex(
        (e) => e.id_agenda === event.id_agenda,
      );
      if (index === -1) return "";
      const styles = ["bg-primary", "bg-secondary", "bg-warning", "bg-info"];
      return styles[index % styles.length];
    },
    prevMonth() {
      this.displayDate = new Date(
        this.displayDate.getFullYear(),
        this.displayDate.getMonth() - 1,
        1,
      );
      this.selectedDay = null;
    },
    nextMonth() {
      this.displayDate = new Date(
        this.displayDate.getFullYear(),
        this.displayDate.getMonth() + 1,
        1,
      );
      this.selectedDay = null;
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
        const eventDate = new Date(event.tanggal_pelaksanaan);
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
  cursor: pointer;
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

.btn-day.selected {
  background-color: rgba(115, 102, 255, 0.12);
  color: #7366ff;
  font-weight: 700;
}

.btn-day.past-day {
  color: #c5c5c5;
}

.btn-day.past-day:hover {
  background-color: #fafafa;
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

.bg-light-success {
  background-color: rgba(40, 199, 111, 0.1) !important;
}
.bg-light-danger {
  background-color: rgba(234, 84, 85, 0.1) !important;
}
.bg-light-warning {
  background-color: rgba(255, 159, 67, 0.1) !important;
}
.bg-light-info {
  background-color: rgba(0, 207, 232, 0.1) !important;
}

.reminder-item {
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.reminder-item:hover {
  background-color: #f8f9fa;
}

.reminder-item.past-event {
  opacity: 0.45;
  position: relative;
}

.reminder-item.past-event:hover {
  opacity: 0.7;
}

.f-11 {
  font-size: 11px;
}

.reminder-list::-webkit-scrollbar {
  width: 4px;
}

.reminder-list::-webkit-scrollbar-track {
  background: transparent;
}

.reminder-list::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 4px;
}

.reminder-list::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}
</style>
