<template>
  <div>
    <Breadcrumbs main="Pembinaan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <pembinaan-table />
      </div>
    </div>
  </div>
</template>

<script>
import PembinaanTable from "./PembinaanTable.vue";

export default {
  components: {
    PembinaanTable,
  },
};
</script>
