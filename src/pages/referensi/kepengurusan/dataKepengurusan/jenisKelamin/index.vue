<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <jenis-kelamin-table />
      </div>
    </div>
  </div>
</template>

<script>
import JenisKelaminTable from "./JenisKelaminTable.vue";

export default {
  components: {
    JenisKelaminTable,
  },
};
</script>
