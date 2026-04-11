<template>
  <div>
    <Breadcrumbs main="Pembinaan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <metode-pembinaan-table />
      </div>
    </div>
  </div>
</template>

<script>
import MetodePembinaanTable from "./MetodePembinaanTable.vue";

export default {
  components: {
    MetodePembinaanTable,
  },
};
</script>
