<template>
  <div>
    <Breadcrumbs main="Lembaga" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <lembaga-table />
      </div>
    </div>
  </div>
</template>

<script>
import LembagaTable from "./LembagaTable.vue";

export default {
  components: {
    LembagaTable,
  },
};
</script>
