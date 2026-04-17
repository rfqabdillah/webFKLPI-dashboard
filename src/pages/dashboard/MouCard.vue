<template>
  <div class="card mou-card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 f-w-600">Status MoU Pelatihan</h5>
        <span
          class="badge rounded-pill bg-light-primary text-primary f-12 px-3 py-2"
        >
          {{ mouList.length }} MoU
        </span>
      </div>
    </div>

    <div class="card-body">
      <!-- Filter Tabs -->
      <div class="status-tabs d-flex gap-2 mb-4 flex-wrap">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          class="btn btn-sm rounded-pill px-3"
          :class="
            activeTab === tab.key
              ? tab.activeClass
              : 'btn-outline-light text-muted'
          "
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="badge rounded-pill ms-1 f-11" :class="tab.badgeClass">
            {{ getCountByStatus(tab.key) }}
          </span>
        </button>
      </div>

      <!-- MoU List -->
      <div
        v-if="displayedMouList.length > 0"
        class="mou-list"
        style="max-height: 480px; overflow-y: auto; padding-right: 4px"
      >
        <div
          v-for="mou in displayedMouList"
          :key="mou.id_mou"
          class="mou-item"
          :class="{ 'mou-selesai': getMouStatus(mou) === 'selesai' }"
        >
          <!-- Header: Company + Status -->
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="d-flex align-items-center gap-2 min-w-0 flex-grow-1">
              <div class="company-logo flex-shrink-0">
                <img
                  v-if="getCompanyLogo(mou)"
                  :src="getCompanyLogo(mou)"
                  :alt="getCompanyName(mou)"
                  class="logo-img"
                />
                <div v-else class="logo-placeholder">
                  <i class="fa fa-building"></i>
                </div>
              </div>
              <div class="min-w-0">
                <h6 class="mb-0 f-w-600 f-14 text-truncate">
                  {{ getCompanyName(mou) }}
                </h6>
                <div class="d-flex align-items-center flex-wrap gap-2 mt-1">
                  <span class="text-muted f-12">
                    <i class="fa fa-handshake-o me-1"></i>
                    {{ getOrganizationName(mou) }}
                  </span>
                  <span class="text-muted f-12 border-start ps-2"
                    >TNA {{ mou.tna?.tahun || "-" }}</span
                  >
                </div>
              </div>
            </div>
            <span
              class="badge rounded-pill f-11 px-2 py-1 flex-shrink-0 ms-2"
              :class="getStatusBadgeClass(mou)"
            >
              <i class="fa me-1" :class="getStatusIcon(mou)"></i>
              {{ getStatusLabel(mou) }}
            </span>
          </div>

          <!-- Progress Bar (only for active MoU) -->
          <div v-if="getMouStatus(mou) === 'aktif'" class="mb-2">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="f-12 text-muted">Progres MoU</span>
              <span class="f-12 f-w-600" :class="getProgressColor(mou)">
                {{ getMouProgress(mou) }}%
              </span>
            </div>
            <div class="progress" style="height: 6px; border-radius: 4px">
              <div
                class="progress-bar"
                :class="getProgressBarClass(mou)"
                role="progressbar"
                :style="{ width: getMouProgress(mou) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Date & Countdown -->
          <div class="d-flex flex-wrap gap-3 mb-2">
            <div class="d-flex align-items-center gap-1">
              <i class="fa fa-calendar-o text-muted f-12"></i>
              <span class="f-12 text-muted">
                {{ formatDate(mou.tanggal_mou_mulai) }} —
                {{ formatDate(mou.tanggal_mou_selesai) }}
              </span>
            </div>
            <span
              v-if="getMouStatus(mou) !== 'selesai'"
              class="f-12 f-w-600"
              :class="getCountdownColor(mou)"
            >
              <i class="fa fa-hourglass-half me-1"></i>
              {{ getCountdownText(mou) }}
            </span>
          </div>

          <!-- KBJI Tags -->
          <div
            v-if="getMouKbjiList(mou).length > 0"
            class="kbji-tags d-flex flex-wrap gap-1"
          >
            <span
              v-for="kbji in getMouKbjiList(mou).slice(0, 3)"
              :key="kbji.id_tna_kbji"
              class="badge bg-light text-muted f-11 rounded-pill"
              :title="kbji.kbji?.nama_kbji"
            >
              {{ kbji.kbji?.nama_kbji || kbji.kode_kbji }}
              <span class="text-primary ms-1">×{{ kbji.jumlah }}</span>
            </span>
            <span
              v-if="getMouKbjiList(mou).length > 3"
              class="badge bg-light text-primary f-11 rounded-pill"
            >
              +{{ getMouKbjiList(mou).length - 3 }} lainnya
            </span>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-end mt-2">
            <a
              v-if="mou.file_mou"
              :href="mou.file_mou"
              target="_blank"
              class="btn btn-sm btn-outline-primary rounded-pill px-3 f-12"
            >
              <i class="fa fa-file-pdf-o me-1"></i> Lihat MoU
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-4">
        <i
          class="fa fa-file-text-o text-muted mb-2"
          style="font-size: 32px"
        ></i>
        <p class="text-muted f-12 mb-0">Tidak ada MoU pada filter ini</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getMou } from "@/services/general/pelatihan/mou";
import { getTnaKBJI } from "@/services/general/pelatihan/tnaKBJI";
import { formatDate } from "@/utils/formatDate";

export default {
  name: "MouCard",
  data() {
    return {
      mouList: [],
      tnaKbjiList: [],
      activeTab: "semua",
      statusTabs: [
        {
          key: "semua",
          label: "Semua",
          activeClass: "btn-primary",
          badgeClass: "bg-white text-primary",
        },
        {
          key: "aktif",
          label: "Dalam Proses",
          activeClass: "btn-success",
          badgeClass: "bg-white text-success",
        },
        {
          key: "akan_datang",
          label: "Akan Datang",
          activeClass: "btn-warning",
          badgeClass: "bg-white text-warning",
        },
        {
          key: "selesai",
          label: "Selesai",
          activeClass: "btn-secondary",
          badgeClass: "bg-white text-secondary",
        },
      ],
    };
  },
  computed: {
    today() {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    },
    displayedMouList() {
      if (this.activeTab === "semua") {
        const sortedList = [...this.mouList];
        const statusPriority = { aktif: 1, akan_datang: 2, selesai: 3 };
        return sortedList.sort((a, b) => {
          return (
            statusPriority[this.getMouStatus(a)] -
            statusPriority[this.getMouStatus(b)]
          );
        });
      }
      return this.mouList.filter(
        (mou) => this.getMouStatus(mou) === this.activeTab,
      );
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [mouRes, kbjiRes] = await Promise.all([getMou(), getTnaKBJI()]);

        if (
          mouRes.data &&
          Array.isArray(mouRes.data) &&
          mouRes.data.length > 0
        ) {
          this.mouList = mouRes.data[0].data || [];
        } else if (mouRes.data?.data) {
          this.mouList = mouRes.data.data;
        }

        if (
          kbjiRes.data &&
          Array.isArray(kbjiRes.data) &&
          kbjiRes.data.length > 0
        ) {
          this.tnaKbjiList = kbjiRes.data[0].data || [];
        } else if (kbjiRes.data?.data) {
          this.tnaKbjiList = kbjiRes.data.data;
        }
      } catch (error) {
        console.error("Failed to fetch MoU data:", error);
      }
    },

    formatDate(date) {
      if (!date) return "-";
      return formatDate(date, "id");
    },

    getMouStatus(mou) {
      const start = new Date(mou.tanggal_mou_mulai);
      const end = new Date(mou.tanggal_mou_selesai);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      if (this.today < start) return "akan_datang";
      if (this.today >= start && this.today <= end) return "aktif";
      return "selesai";
    },
    getStatusLabel(mou) {
      const status = this.getMouStatus(mou);
      if (status === "aktif") return "Dalam Proses Pelatihan";
      if (status === "akan_datang") return "Akan Datang";
      return "Selesai";
    },
    getStatusBadgeClass(mou) {
      const status = this.getMouStatus(mou);
      if (status === "aktif") return "bg-light-success text-success";
      if (status === "akan_datang") return "bg-light-warning text-warning";
      return "bg-light text-muted";
    },
    getStatusIcon(mou) {
      const status = this.getMouStatus(mou);
      if (status === "aktif") return "fa-circle dot-active-blinking";
      if (status === "akan_datang") return "fa-clock-o";
      return "fa-check-circle";
    },

    getMouProgress(mou) {
      const start = new Date(mou.tanggal_mou_mulai);
      const end = new Date(mou.tanggal_mou_selesai);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const total = end - start;
      if (total <= 0) return 100;
      const elapsed = this.today - start;
      return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    },
    getProgressBarClass(mou) {
      const progress = this.getMouProgress(mou);
      if (progress >= 80) return "bg-danger";
      if (progress >= 50) return "bg-warning";
      return "bg-success";
    },
    getProgressColor(mou) {
      const progress = this.getMouProgress(mou);
      if (progress >= 80) return "text-danger";
      if (progress >= 50) return "text-warning";
      return "text-success";
    },

    getCountdownText(mou) {
      const status = this.getMouStatus(mou);
      if (status === "akan_datang") {
        const start = new Date(mou.tanggal_mou_mulai);
        start.setHours(0, 0, 0, 0);
        const days = Math.ceil((start - this.today) / (1000 * 60 * 60 * 24));
        return `Mulai dalam ${days} hari`;
      }
      if (status === "aktif") {
        const end = new Date(mou.tanggal_mou_selesai);
        end.setHours(0, 0, 0, 0);
        const days = Math.ceil((end - this.today) / (1000 * 60 * 60 * 24));
        return days === 0 ? "Berakhir hari ini!" : `Sisa ${days} hari`;
      }
      return "";
    },
    getCountdownColor(mou) {
      const status = this.getMouStatus(mou);
      if (status === "akan_datang") return "text-warning";
      if (status === "aktif") {
        const end = new Date(mou.tanggal_mou_selesai);
        end.setHours(0, 0, 0, 0);
        const days = Math.ceil((end - this.today) / (1000 * 60 * 60 * 24));
        if (days <= 3) return "text-danger";
        if (days <= 7) return "text-warning";
        return "text-success";
      }
      return "text-muted";
    },

    getMouKbjiList(mou) {
      if (!mou.id_tna) return [];
      return this.tnaKbjiList.filter((k) => k.id_tna === mou.id_tna);
    },

    getCompanyName(mou) {
      return mou.perusahaan?.nama_perusahaan || "-";
    },
    getOrganizationName(mou) {
      if (mou.fklpi && mou.fklpi.nama_organisasi) {
        return mou.fklpi.nama_organisasi;
      }
      if (mou["uptp-uptd"] && mou["uptp-uptd"].nama_lembaga) {
        return mou["uptp-uptd"].nama_lembaga;
      }
      return "-";
    },
    getCompanyLogo(mou) {
      const kbjiItem = this.tnaKbjiList.find(
        (k) => k.id_tna === mou.id_tna && k.perusahaan?.logo_perusahaan,
      );
      return kbjiItem?.perusahaan?.logo_perusahaan || null;
    },

    getCountByStatus(statusKey) {
      if (statusKey === "semua") return this.mouList.length;
      return this.mouList.filter((m) => this.getMouStatus(m) === statusKey)
        .length;
    },
  },
};
</script>

<style scoped>
.mou-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.mou-item {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  background: #fff;
}

.mou-item:hover {
  border-color: #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.mou-item.mou-selesai {
  opacity: 0.5;
}

.mou-item.mou-selesai:hover {
  opacity: 0.75;
}

.company-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;
  background: #fafafa;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c5c5c5;
  font-size: 16px;
}

.progress {
  background-color: #f0f0f0;
}

.bg-light-primary {
  background-color: rgba(115, 102, 255, 0.1) !important;
}

.bg-light-success {
  background-color: rgba(40, 199, 111, 0.1) !important;
}

.bg-light-warning {
  background-color: rgba(255, 159, 67, 0.1) !important;
}

.status-tabs .btn {
  border: 1px solid #eee;
  font-size: 12px;
  font-weight: 500;
}

.status-tabs .btn:hover {
  border-color: #ddd;
}

.mou-list::-webkit-scrollbar {
  width: 4px;
}

.mou-list::-webkit-scrollbar-track {
  background: transparent;
}

.mou-list::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 4px;
}

.mou-list::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.f-11 {
  font-size: 11px;
}

@media (max-width: 575px) {
  .status-tabs {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 1rem !important;
  }
  .status-tabs .btn {
    white-space: nowrap;
    padding: 5px 10px !important;
  }
  .mou-item .badge {
    white-space: normal;
    max-width: 110px;
    line-height: 1.2;
  }
}

/* Status Dot Blinking Animation */
.dot-active-blinking {
  font-size: 8px;
  vertical-align: middle;
  animation: dot-blink 1.5s infinite;
}

@keyframes dot-blink {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
