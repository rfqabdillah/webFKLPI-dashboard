<template>
  <div>
    <Breadcrumbs main="Pembinaan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <jenis-pembinaan-table />
      </div>
    </div>
  </div>
</template>

<script>
import JenisPembinaanTable from "./JenisPembinaanTable.vue";

export default {
  components: {
    JenisPembinaanTable,
  },
};
</script>
