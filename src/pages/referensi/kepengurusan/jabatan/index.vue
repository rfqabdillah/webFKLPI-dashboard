<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <jabatan-table />
      </div>
    </div>
  </div>
</template>

<script>
import JabatanTable from "./JabatanTable.vue";

export default {
  components: {
    JabatanTable,
  },
};
</script>
