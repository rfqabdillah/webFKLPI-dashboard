<template>
  <div>
    <Breadcrumbs main="TNA" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <tna-pelatihan-table />
      </div>
    </div>
  </div>
</template>

<script>
import TnaPelatihanTable from "./TnaPelatihanTable.vue";

export default {
  components: {
    TnaPelatihanTable,
  },
};
</script>
