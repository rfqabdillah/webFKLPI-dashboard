<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <golongan-darah-table />
      </div>
    </div>
  </div>
</template>

<script>
import GolonganDarahTable from "./GolonganDarahTable.vue";

export default {
  components: {
    GolonganDarahTable,
  },
};
</script>
