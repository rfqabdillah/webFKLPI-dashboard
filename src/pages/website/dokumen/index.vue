<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <dokumen-table />
      </div>
    </div>
  </div>
</template>

<script>
import DokumenTable from "./DokumenTable.vue";

export default {
  components: {
    DokumenTable,
  },
};
</script>
