<template>
  <div class="header-logo-wrapper col-auto p-0">
    <div class="logo-wrapper">
      <router-link to="/">
        <img
          v-if="dynamicLogoUrl && !isLoadingLogo"
          class="img-fluid for-light"
          :src="dynamicLogoUrl"
          :alt="appName"
          style="max-height: 45px; width: auto; object-fit: contain"
          @error="handleImageError"
        />

        <div v-else-if="isLoadingLogo" class="logo-skeleton shimmer"></div>

        <div
          v-else
          class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm"
          style="
            min-height: 45px;
            max-height: 55px;
            width: auto;
            min-width: 45px;
            border: 1px solid #dee2e6;
          "
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
import { getAplikasi } from "@/services/public/aplikasiPublic";

const store = useStore();

// === State ===
const dynamicLogoUrl = ref(null);
const appName = ref("Aplikasi");
const isLoadingLogo = ref(true);

// === Methods ===

function toggle_sidebar() {
  store.dispatch("menu/opensidebar");
}

function handleImageError() {
  dynamicLogoUrl.value = null;
}

// === Fetch Data ===
async function fetchLogoData() {
  isLoadingLogo.value = true;
  try {
    const response = await getAplikasi();

    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        const innerArray = response.data[0].data;
        if (Array.isArray(innerArray) && innerArray.length > 0) {
          sourceData = innerArray[0];
        }
      }
    }

    if (sourceData) {
      appName.value = sourceData.nama_instansi || "Aplikasi";

      if (sourceData.logo && sourceData.logo !== "") {
        dynamicLogoUrl.value = sourceData.logo;
      } else {
        dynamicLogoUrl.value = null;
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

<style>
.page-wrapper.horizontal-wrapper .logo-wrapper img {
  max-height: 60px !important;
}

.page-wrapper.horizontal-wrapper .logo-wrapper > a > div {
  min-height: 60px !important;
  max-height: 60px !important;
}

/* Skeleton Loader */
.logo-skeleton {
  width: 120px;
  height: 45px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.shimmer {
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
