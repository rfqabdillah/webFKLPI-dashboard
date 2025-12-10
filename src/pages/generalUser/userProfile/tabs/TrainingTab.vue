<template>
  <div class="row">
    <div
      v-for="item in items"
      :key="item.idpenggunapelatihan"
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
                <i class="fa fa-chalkboard-teacher fa-lg"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="fw-bold text-dark mb-1">
                    {{ item.namapelatihan }}
                  </h6>

                  <div class="text-muted small mb-2">
                    <i class="fa fa-user-tie me-1"></i>
                    {{
                      item.namapenyelenggarapelatihan ||
                      item.namapenyelenggara ||
                      "-"
                    }}
                  </div>
                </div>
                <span
                  class="badge rounded-pill px-3 py-1"
                  :class="
                    item.status === 'Aktif'
                      ? 'bg-soft-success text-success'
                      : 'bg-soft-secondary text-secondary'
                  "
                >
                  {{ item.status }}
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
            Data Pelatihan Tidak Ditemukan!
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
});
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
