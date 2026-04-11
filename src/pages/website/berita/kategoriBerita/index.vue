<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <kategori-berita-table />
      </div>
    </div>
  </div>
</template>

<script>
import KategoriBeritaTable from "./KategoriBeritaTable.vue";

export default {
  components: {
    KategoriBeritaTable,
  },
};
</script>
