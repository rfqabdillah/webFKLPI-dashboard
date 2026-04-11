<template>
  <div>
    <Breadcrumbs main="Organisasi" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <perusahaan-table />
      </div>
    </div>
  </div>
</template>

<script>
import PerusahaanTable from "./PerusahaanTable.vue";

export default {
  components: {
    PerusahaanTable,
  },
};
</script>
