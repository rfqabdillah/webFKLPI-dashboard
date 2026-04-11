<template>
  <router-link to="/">
    <img
      v-if="dynamicLogoUrl && !isLoadingLogo"
      class="img-fluid for-light"
      :src="sidebarType ? dynamicLogoUrl : faviconUrl || dynamicLogoUrl"
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import { getAplikasi } from "@/services/public/aplikasiPublic";

const store = useStore();
const sidebarType = computed(() => store.state.menu.togglesidebar);

// State
const dynamicLogoUrl = ref(null);
const faviconUrl = ref(null);
const appName = ref("Aplikasi");
const isLoadingLogo = ref(true);

// Method
function handleImageError() {
  console.warn("Gagal memuat logo, beralih ke placeholder.");
  dynamicLogoUrl.value = null;
}

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
      appName.value = sourceData.namainstansi || "Aplikasi";

      if (sourceData.logo && sourceData.logo !== "") {
        dynamicLogoUrl.value = sourceData.logo;
      } else {
        dynamicLogoUrl.value = null;
      }

      if (sourceData.favicon && sourceData.favicon !== "") {
        faviconUrl.value = sourceData.favicon;
      } else {
        faviconUrl.value = null;
      }
    } else {
      dynamicLogoUrl.value = null;
      faviconUrl.value = null;
    }
  } catch (error) {
    console.error("Error fetching logo data:", error);
    dynamicLogoUrl.value = null;
  } finally {
    isLoadingLogo.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchLogoData();
  window.addEventListener("app-settings-updated", fetchLogoData);
});

onUnmounted(() => {
  window.removeEventListener("app-settings-updated", fetchLogoData);
});
</script>

<style scoped>
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
