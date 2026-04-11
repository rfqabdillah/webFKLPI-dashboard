<template>
  <div>
    <Breadcrumbs main="Peran" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <peran-table />
      </div>
    </div>
  </div>
</template>

<script>
import PeranTable from "./PeranTable.vue";

export default {
  components: {
    PeranTable,
  },
};
</script>
