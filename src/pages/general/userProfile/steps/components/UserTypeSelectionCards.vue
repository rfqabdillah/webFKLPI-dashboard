<template>
  <div class="user-type-selection">
    <div class="text-center mb-3">
      <h6 class="fw-bold text-dark mb-1">
        <i class="fa fa-user-tag me-2"></i>Pilih Jenis Pengguna
      </h6>
      <p class="text-muted small mb-0">
        Silakan pilih jenis pengguna untuk melanjutkan
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Memuat jenis pengguna...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-5">
      <i class="fa fa-exclamation-triangle text-warning fa-3x mb-3"></i>
      <p class="text-muted">{{ error }}</p>
      <button class="btn btn-outline-primary btn-sm" @click="fetchUserTypes">
        <i class="fa fa-refresh me-1"></i>Coba Lagi
      </button>
    </div>

    <!-- Selection Cards -->
    <div v-else class="row g-3 justify-content-center">
      <div
        v-for="userType in userTypes"
        :key="userType.idjenispengguna"
        class="col-6 col-md-5 col-lg-4"
      >
        <div
          class="selection-card"
          :class="{ active: hoveredCard === userType.idjenispengguna }"
          @mouseenter="hoveredCard = userType.idjenispengguna"
          @mouseleave="hoveredCard = null"
          @click="selectUserType(userType)"
        >
          <div class="card-content">
            <div
              class="card-icon"
              :class="getIconClass(userType.namajenispengguna)"
            >
              <i :class="getIcon(userType.namajenispengguna)"></i>
            </div>
            <div class="card-title">{{ userType.namajenispengguna }}</div>
            <p class="card-description">
              {{ getDescription(userType.namajenispengguna) }}
            </p>
            <div class="card-action">
              <i class="fa fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserTypes } from "@/services/referensi/userTypes";
import { useToast } from "vue-toastification";

const emit = defineEmits(["select-user-type"]);
const toast = useToast();

const userTypes = ref([]);
const isLoading = ref(false);
const error = ref(null);
const hoveredCard = ref(null);

onMounted(() => {
  fetchUserTypes();
});

async function fetchUserTypes() {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await getUserTypes({
      page: 1,
      limit: 100,
      sort: "namajenispengguna",
      dir: "asc",
    });

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        userTypes.value = response.data[0].data;
      } else {
        userTypes.value = response.data;
      }
    } else if (response.data?.data) {
      userTypes.value = response.data.data;
    } else {
      userTypes.value = [];
    }

    if (userTypes.value.length === 0) {
      error.value = "Tidak ada jenis pengguna yang tersedia";
    }
  } catch (err) {
    console.error("Error fetching user types:", err);
    error.value = "Gagal memuat jenis pengguna";
    toast.error("Gagal memuat data jenis pengguna");
  } finally {
    isLoading.value = false;
  }
}

function selectUserType(userType) {
  emit("select-user-type", userType);
}

function getIcon(name) {
  const nameLower = name?.toLowerCase() || "";
  if (nameLower.includes("asn") && !nameLower.includes("non")) {
    return "fa fa-id-badge";
  } else if (nameLower.includes("non")) {
    return "fa fa-user";
  }
  return "fa fa-user-circle";
}

function getIconClass(name) {
  const nameLower = name?.toLowerCase() || "";
  if (nameLower.includes("asn") && !nameLower.includes("non")) {
    return "icon-asn";
  } else if (nameLower.includes("non")) {
    return "icon-non-asn";
  }
  return "";
}

function getDescription(name) {
  const nameLower = name?.toLowerCase() || "";
  if (nameLower.includes("asn") && !nameLower.includes("non")) {
    return "Aparatur Sipil Negara dengan NIP dan kepangkatan resmi";
  } else if (nameLower.includes("non")) {
    return "Pegawai non-ASN seperti honorer, kontrak, atau magang";
  }
  return "Jenis pengguna lainnya";
}
</script>

<style scoped>
.user-type-selection {
  padding: 0.75rem;
}

.selection-card {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 14px;
  padding: 0.875rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.selection-card:hover {
  border-color: #0d6efd;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.15);
}

.selection-card.active {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.75rem;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.card-icon.icon-asn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.35);
}

.card-icon.icon-non-asn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.35);
}

.card-title {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.375rem;
  font-size: 1rem;
}

.card-description {
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.selection-card:hover .card-action {
  background: #0d6efd;
  color: #fff;
  transform: translateX(2px);
}
</style>
