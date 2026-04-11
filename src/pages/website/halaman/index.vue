<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <halaman-table />
      </div>
    </div>
  </div>
</template>

<script>
import HalamanTable from "./HalamanTable.vue";

export default {
  components: {
    HalamanTable,
  },
};
</script>
