<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useIdleLogout } from "@/utils/useIdleLogout";
import { getApplicationPub } from "@/services/general/website/settings/applicationsPublic";

useIdleLogout();

async function setupAppIdentity() {
  try {
    const response = await getApplicationPub();
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
      if (sourceData.namainstansi) {
        document.title = sourceData.namainstansi;
      }

      if (sourceData.favicon && sourceData.favicon !== "") {
        let link = document.querySelector("link[rel~='icon']");

        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }

        link.href = sourceData.favicon;
      }
    }
  } catch (error) {
    console.error("Gagal memuat identitas aplikasi (Favicon/Title):", error);
  }
}

onMounted(() => {
  setupAppIdentity();

  window.addEventListener("app-settings-updated", setupAppIdentity);
});

onUnmounted(() => {
  window.removeEventListener("app-settings-updated", setupAppIdentity);
});
</script>
