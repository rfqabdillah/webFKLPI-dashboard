<template>
  <div>
    <!-- Actual Content -->
    <div class="row">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="col-xl-4 col-sm-6 mb-4"
      >
        <div class="card widget-1">
          <div class="card-body">
            <div class="widget-content">
              <div class="widget-round" :class="stat.color">
                <div class="bg-round">
                  <i
                    v-if="stat.icon.startsWith('fa-')"
                    :class="['f-24', stat.icon, 'text-' + stat.color]"
                  ></i>
                  <svg v-else class="svg-icon" :class="'text-' + stat.color">
                    <use
                      :xlink:href="
                        require('@/assets/svg/icon-sprite.svg') +
                        '#' +
                        stat.icon
                      "
                    ></use>
                  </svg>
                  <svg
                    class="half-circle svg-fill"
                    :class="'text-' + stat.color"
                  >
                    <use
                      :xlink:href="
                        require('@/assets/svg/icon-sprite.svg') + '#halfcircle'
                      "
                    ></use>
                  </svg>
                </div>
              </div>
              <div>
                <h4>{{ stat.value }}</h4>
                <span class="f-light">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers } from "@/services/referensi/users";
import { getEvents } from "@/services/general/events/events";
import { getNews } from "@/services/general/website/news/news";
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";
import {
  STATUS_TERDAFTAR_ID,
  STATUS_DITERIMA_ID,
  STATUS_DITOLAK_ID,
} from "@/constants/agendaStatus";

export default {
  name: "InfoCard",
  data() {
    return {
      stats: [
        // Row 1
        {
          label: "Jumlah Pegawai",
          value: 0,
          icon: "stroke-user",
          color: "primary",
          percent: 75,
        },
        {
          label: "Agenda Aktif",
          value: 0,
          icon: "stroke-calendar",
          color: "purple",
          percent: 60,
        },
        {
          label: "Berita Tayang",
          value: 0,
          icon: "stroke-newspaper",
          color: "warning",
          percent: 85,
        },
        // Row 2
        {
          label: "Pengguna Terdaftar",
          value: 0,
          icon: "stroke-clock",
          color: "cyan",
          percent: 70,
        },
        {
          label: "Pengguna Diterima",
          value: 0,
          icon: "fa-solid fa-check",
          color: "success",
          percent: 45,
        },
        {
          label: "Pengguna Ditolak",
          value: 0,
          icon: "fa-solid fa-xmark",
          color: "danger",
          percent: 30,
        },
      ],
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [
          userRes,
          eventRes,
          newsRes,
          registeredRes,
          acceptedRes,
          rejectedRes,
        ] = await Promise.all([
          getUsers(),
          getEvents({ filter: "tayang=Tayang" }),
          getNews({ filter: "tayang=Tayang" }),
          getEventUsers({ filter: `id_status=${STATUS_TERDAFTAR_ID}` }),
          getEventUsers({ filter: `id_status=${STATUS_DITERIMA_ID}` }),
          getEventUsers({ filter: `id_status=${STATUS_DITOLAK_ID}` }),
        ]);

        this.stats[0].value = this.extractCount(userRes);
        this.stats[1].value = this.extractCount(eventRes);
        this.stats[2].value = this.extractCount(newsRes);
        this.stats[3].value = this.extractCount(registeredRes);
        this.stats[4].value = this.extractCount(acceptedRes);
        this.stats[5].value = this.extractCount(rejectedRes);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    },
    extractCount(response) {
      if (!response || !response.data) return 0;
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        if (firstItem?.meta?.pagination?.total !== undefined)
          return firstItem.meta.pagination.total;
        if (firstItem?.data && Array.isArray(firstItem.data))
          return firstItem.total || firstItem.data.length;
      }

      if (data?.total !== undefined) return data.total;
      if (Array.isArray(data)) return data.length;
      if (data?.data && Array.isArray(data.data)) return data.data.length;

      return 0;
    },
  },
};
</script>

<style scoped>
.f-24 {
  font-size: 24px;
}
.f-14 {
  font-size: 14px;
}
.svg-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor; /* Default to stroke */
  fill: none;
  vertical-align: middle;
}
.card.widget-1 {
  background-image: none !important;
  background-color: #ffffff !important;
}

@keyframes zoom-tilt-cycle {
  0% {
    transform: scale(1) rotate(0deg);
  }
  5% {
    transform: scale(1.2) rotate(0deg);
  }
  10% {
    transform: scale(1.2) rotate(15deg);
  }
  15% {
    transform: scale(1.2) rotate(-15deg);
  }
  20% {
    transform: scale(1.2) rotate(15deg);
  }
  25% {
    transform: scale(1.2) rotate(-15deg);
  }
  30% {
    transform: scale(1.2) rotate(15deg);
  }
  35% {
    transform: scale(1.2) rotate(-15deg);
  }
  40% {
    transform: scale(1.2) rotate(15deg);
  }
  45% {
    transform: scale(1.2) rotate(-15deg);
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  55% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.card.widget-1:hover .bg-round i,
.card.widget-1:hover .bg-round .svg-icon {
  animation: zoom-tilt-cycle 2.5s ease-in-out infinite;
  display: inline-block;
}

.text-purple {
  color: #7366ff !important;
}
.text-cyan {
  color: #16c7f9 !important;
}

.fill-icon {
  fill: currentColor !important;
  stroke: none !important;
}

.widget-round.primary .text-primary {
  color: var(--theme-deafult) !important;
}

.card.widget-1 .widget-round.purple {
  border-color: #7366ff !important;
}
.card.widget-1 .widget-round.cyan {
  border-color: #16c7f9 !important;
}
.card.widget-1 .widget-round.danger {
  border-color: #dc3545 !important;
}

.widget-round.primary .half-circle {
  fill: var(--theme-deafult) !important;
}
.widget-round.purple .half-circle {
  fill: #7366ff !important;
}
.widget-round.cyan .half-circle {
  fill: #16c7f9 !important;
}
.widget-round.danger .half-circle {
  fill: #dc3545 !important;
}
</style>
