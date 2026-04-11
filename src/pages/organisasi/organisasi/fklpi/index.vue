<template>
  <div>
    <Breadcrumbs main="Organisasi" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <FKLPITable />
      </div>
    </div>
  </div>
</template>

<script>
import FKLPITable from "./FKLPITable.vue";

export default {
  components: {
    FKLPITable,
  },
};
</script>
