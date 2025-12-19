<template>
  <div class="row">
    <div
      v-for="item in items"
      :key="item.idpenggunaprestasi"
      class="col-12"
      style="margin-bottom: 5px"
    >
      <div class="card shadow-sm border hover-lift">
        <div class="card-body p-4">
          <div class="d-flex align-items-start">
            <!-- Uniform Icon Box -->
            <div class="flex-shrink-0 me-4">
              <div
                class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
                style="width: 50px; height: 50px"
              >
                <i class="fa fa-trophy fa-lg"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="fw-bold text-dark mb-1">
                    {{ item.namaprestasi }}
                  </h6>

                  <div class="text-muted small mb-1">
                    <i class="fa fa-user-tie me-1"></i>
                    {{ item.namapenyelenggaraprestasi || "-" }}
                  </div>

                  <div class="d-flex align-items-center mt-2 text-muted small">
                    <i class="fa fa-globe me-2"></i>
                    <span>{{ $t("Scale") }}: </span>
                    <span class="fw-bold ms-1">{{ getScaleName(item) }}</span>
                  </div>
                </div>
                <span
                  class="badge rounded-pill px-3 py-1"
                  :class="
                    item.statusprestasi === 'Aktif'
                      ? 'bg-soft-success text-success'
                      : 'bg-soft-secondary text-secondary'
                  "
                >
                  {{ item.statusprestasi }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!items?.length" class="col-12">
      <div
        class="custom-warning-alert d-flex align-items-center mb-4 shadow-sm"
      >
        <div class="alert-icon-box me-3">
          <i class="fa fa-exclamation text-white"></i>
        </div>
        <div class="alert-content">
          <span class="fw-bold d-block" style="color: #ff5b57">
            {{ $t("Achievement Data Not Found") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  user: {
    type: Object,
    default: () => ({}),
  },
});

function getScaleName(item) {
  if (item.namaskala) return item.namaskala;

  if (props.user["scale"]) {
    const scale = props.user["scale"].find((s) => s.idskala === item.idskala);
    return scale ? scale.namaskala : "-";
  }
  return "-";
}
</script>

<style scoped>
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.bg-soft-success {
  background-color: rgba(25, 135, 84, 0.1);
}

.bg-soft-secondary {
  background-color: rgba(108, 117, 125, 0.1);
}

.custom-warning-alert {
  background-color: #fdecec;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #fadbd8;
}

.alert-icon-box {
  background-color: #ff5b57;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
