<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <aplikasi-settings />
      </div>
    </div>
  </div>
</template>

<script>
import AplikasiSettings from "./AplikasiSettings.vue";

export default {
  components: {
    AplikasiSettings,
  },
};
</script>
