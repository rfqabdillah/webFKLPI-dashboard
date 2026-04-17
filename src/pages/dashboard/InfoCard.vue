<template>
  <div class="row">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="col-xl-4 col-md-6 col-sm-12"
    >
      <div class="info-stat-card card border-0">
        <div class="card-body p-0">
          <div class="stat-inner d-flex align-items-center gap-3">
            <div class="stat-icon-wrap" :class="`bg-soft-${stat.color}`">
              <i :class="[stat.icon, `text-${stat.color}`, 'f-22']"></i>
            </div>

            <!-- Text Content -->
            <div class="stat-text flex-grow-1">
              <p class="stat-label mb-1">{{ stat.label }}</p>
              <h3 class="stat-value mb-0">
                {{ stat.animatedValue.toLocaleString("id-ID") }}
              </h3>
            </div>
            <div class="stat-arc" :class="`arc-${stat.color}`" />
          </div>
          <div class="stat-bar" :class="`bar-${stat.color}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLembaga } from "@/services/general/organisasi/lembaga";
import { getPerusahaan } from "@/services/general/organisasi/perusahaan";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";

export default {
  name: "InfoCard",

  data() {
    return {
      isLoading: true,

      stats: [
        {
          label: "Jumlah FKLPI P/D",
          value: 0,
          animatedValue: 0,
          icon: "fa-solid fa-sitemap",
          color: "primary",
        },
        {
          label: "Jumlah Lembaga",
          value: 0,
          animatedValue: 0,
          icon: "fa-solid fa-building-columns",
          color: "warning",
        },
        {
          label: "Jumlah Perusahaan",
          value: 0,
          animatedValue: 0,
          icon: "fa-solid fa-building",
          color: "success",
        },
      ],
    };
  },

  async mounted() {
    await this.fetchData();
  },

  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        const [resOrg, resLembaga, resPerusahaan] = await Promise.allSettled([
          getOrganisasi(),
          getLembaga(),
          getPerusahaan(),
        ]);

        const val0 = this.extractCount(resOrg);
        const val1 = this.extractCount(resLembaga);
        const val2 = this.extractCount(resPerusahaan);

        this.stats[0].value = val0;
        this.stats[1].value = val1;
        this.stats[2].value = val2;

        this.animateCount(this.stats[0], val0);
        this.animateCount(this.stats[1], val1);
        this.animateCount(this.stats[2], val2);
      } catch (err) {
        console.error("InfoCard: gagal memuat data:", err);
      } finally {
        this.isLoading = false;
      }
    },

    animateCount(stat, targetValue, duration = 1800) {
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        stat.animatedValue = Math.round(easeOut(progress) * targetValue);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    },

    extractCount(settled) {
      if (settled.status !== "fulfilled") return 0;
      let payload = settled.value?.data;
      if (!payload) return 0;

      if (
        Array.isArray(payload) &&
        payload.length > 0 &&
        (payload[0].data || payload[0].meta)
      ) {
        payload = payload[0];
      }

      if (payload?.meta?.pagination?.total !== undefined)
        return payload.meta.pagination.total;

      if (payload.total !== undefined) return payload.total;

      if (Array.isArray(payload.data)) return payload.data.length;

      if (Array.isArray(payload)) return payload.length;

      return 0;
    },
  },
};
</script>

<style scoped>
.info-stat-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: var(--white, #fff);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.info-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-inner {
  padding: 20px 20px 16px;
  position: relative;
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.info-stat-card:hover .stat-icon-wrap {
  transform: rotate(8deg) scale(1.1);
}

.bg-soft-primary {
  background: rgba(115, 102, 255, 0.12);
}
.bg-soft-warning {
  background: rgba(255, 163, 25, 0.12);
}
.bg-soft-success {
  background: rgba(84, 186, 116, 0.12);
}

.f-22 {
  font-size: 22px;
}

.stat-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--light-font, #8d8d8d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--body-font-color, #2b2b2b);
  line-height: 1;
}

.stat-arc {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0.06;
  pointer-events: none;
}
.arc-primary {
  background: var(--theme-deafult, #7366ff);
}
.arc-warning {
  background: #ffa319;
}
.arc-success {
  background: #54ba74;
}

.stat-bar {
  height: 4px;
  border-radius: 0 0 16px 16px;
}
.bar-primary {
  background: linear-gradient(90deg, var(--theme-deafult, #7366ff), #a78bfa);
}
.bar-warning {
  background: linear-gradient(90deg, #ffa319, #ffd27d);
}
.bar-success {
  background: linear-gradient(90deg, #54ba74, #94dba4);
}

.text-primary {
  color: var(--theme-deafult, #7366ff) !important;
}
.text-warning {
  color: #ffa319 !important;
}
.text-success {
  color: #54ba74 !important;
}
</style>
