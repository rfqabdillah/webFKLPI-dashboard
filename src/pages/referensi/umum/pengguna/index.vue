<template>
  <div>
    <Breadcrumbs main="Umum" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <pengguna-table />
      </div>
    </div>
  </div>
</template>

<script>
import PenggunaTable from "./PenggunaTable.vue";

export default {
  components: {
    PenggunaTable,
  },
};
</script>
