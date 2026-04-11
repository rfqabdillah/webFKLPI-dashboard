<template>
  <div>
    <Breadcrumbs main="Wilayah" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <wilayah-table />
      </div>
    </div>
  </div>
</template>

<script>
import WilayahTable from "./WilayahTable.vue";

export default {
  components: {
    WilayahTable,
  },
};
</script>
