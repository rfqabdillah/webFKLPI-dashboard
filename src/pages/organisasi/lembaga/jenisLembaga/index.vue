<template>
  <div>
    <Breadcrumbs main="Lembaga" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <jenis-lembaga-table />
      </div>
    </div>
  </div>
</template>

<script>
import JenisLembagaTable from "./JenisLembagaTable.vue";

export default {
  components: {
    JenisLembagaTable,
  },
};
</script>
