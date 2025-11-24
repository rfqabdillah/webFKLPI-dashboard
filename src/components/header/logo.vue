<template>
  <div class="header-logo-wrapper col-auto p-0">
    <div class="logo-wrapper">
      <router-link to="/">
        <img
          v-if="dynamicLogoUrl && !isLoadingLogo"
          class="img-fluid for-light"
          :src="dynamicLogoUrl"
          :alt="appName"
          style="width: 45px; height: 45px; object-fit: contain"
          @error="handleImageError"
        />

        <div
          v-else-if="isLoadingLogo"
          class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm"
          style="width: 45px; height: 45px; border: 1px solid #dee2e6"
        >
          <div
            class="spinner-border text-primary"
            role="status"
            style="width: 1.5rem; height: 1.5rem"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div
          v-else
          class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm"
          style="width: 45px; height: 45px; border: 1px solid #dee2e6"
        >
          <span
            class="fw-bold text-secondary"
            style="font-size: 10px; letter-spacing: 1px; user-select: none"
          >
            LOGO
          </span>
        </div>
      </router-link>
    </div>

    <div class="toggle-sidebar" @click="toggle_sidebar">
      <vue-feather
        class="status_toggle middle sidebar-toggle"
        type="align-center"
        id="sidebar-toggle"
      ></vue-feather>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
// Import service API
import { getApplication } from "@/services/general/website/settings/applications";

const store = useStore();

// === State ===
const dynamicLogoUrl = ref(null);
const appName = ref("Aplikasi");
const isLoadingLogo = ref(true);

// === Methods ===

// Fungsi Toggle Sidebar (Konversi ke Composition API)
function toggle_sidebar() {
  store.dispatch("menu/opensidebar");
}

// Handle jika gambar rusak (404)
function handleImageError() {
  // console.warn("Gambar logo rusak/tidak ditemukan, beralih ke teks default.");
  dynamicLogoUrl.value = null;
}

// === Fetch Data ===
async function fetchLogoData() {
  isLoadingLogo.value = true;
  try {
    const response = await getApplication();

    // Logika Drill Down (Sesuai struktur JSON API Anda)
    let sourceData = null;

    // Cek Array Luar
    if (response.data && Array.isArray(response.data)) {
      // Cek Object 'data' didalamnya
      if (response.data[0] && response.data[0].data) {
        const innerArray = response.data[0].data;
        // Ambil record pertama
        if (Array.isArray(innerArray) && innerArray.length > 0) {
          sourceData = innerArray[0];
        }
      }
    }

    // Mapping Data
    if (sourceData) {
      appName.value = sourceData.namainstansi || "Aplikasi";

      // Cek apakah field logo ada isinya
      if (sourceData.logo && sourceData.logo !== "") {
        dynamicLogoUrl.value = sourceData.logo;
      } else {
        dynamicLogoUrl.value = null; // Kosong -> Tampilkan teks "LOGO"
      }
    } else {
      dynamicLogoUrl.value = null;
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
    dynamicLogoUrl.value = null;
  } finally {
    isLoadingLogo.value = false;
  }
}

// === Lifecycle ===
onMounted(() => {
  fetchLogoData();
});
</script>

<style scoped>
/* Anda bisa menambahkan style khusus di sini jika diperlukan */
</style>
