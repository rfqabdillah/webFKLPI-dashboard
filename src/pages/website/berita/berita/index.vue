<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <berita-table />
      </div>
    </div>
  </div>
</template>

<script>
import BeritaTable from "./BeritaTable.vue";

export default {
  components: {
    BeritaTable,
  },
};
</script>
