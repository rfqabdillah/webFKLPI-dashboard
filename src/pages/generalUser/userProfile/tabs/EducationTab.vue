<template>
  <div class="row">
    <div
      v-for="item in items"
      :key="item.idpenggunapendidikan"
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
                <i class="fa fa-graduation-cap fa-lg"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <div>
                <div class="mb-2">
                  <span class="badge bg-soft-primary text-primary px-3 py-1">
                    {{ getEducationLevelName(item) }}
                  </span>
                </div>
                <h6 class="fw-bold text-dark mb-1">
                  {{ item.namaperguruantinggi }}
                </h6>
                <p class="text-muted small mb-2">{{ item.programstudi }}</p>

                <div class="d-flex align-items-center">
                  <small class="text-muted fw-bold">
                    <i class="fa fa-calendar-check me-1"></i> Lulus:
                    {{ item.tahunlulus }}
                  </small>
                </div>
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
            Data Pendidikan Tidak Ditemukan!
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

function getEducationLevelName(item) {
  if (item.nama_jenjang_pendidikan || item.namajenjangpendidikan)
    return item.nama_jenjang_pendidikan || item.namajenjangpendidikan;
  if (props.user["education-levels"]) {
    const edu = props.user["education-levels"].find(
      (e) => e.idjenjangpendidikan
    );
    return edu ? edu.namajenjangpendidikan : "-";
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

.bg-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
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
