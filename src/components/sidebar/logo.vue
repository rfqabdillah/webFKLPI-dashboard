<template>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getApplication } from "@/services/general/website/settings/applications";

// State
const dynamicLogoUrl = ref(null);
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
    const response = await getApplication();
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
    } else {
      dynamicLogoUrl.value = null;
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
