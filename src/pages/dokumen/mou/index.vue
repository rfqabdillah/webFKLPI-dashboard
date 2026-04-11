<template>
  <div>
    <Breadcrumbs main="Dokumen" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <mou-table />
      </div>
    </div>
  </div>
</template>

<script>
import MouTable from "./MouTable.vue";

export default {
  components: {
    MouTable,
  },
};
</script>
