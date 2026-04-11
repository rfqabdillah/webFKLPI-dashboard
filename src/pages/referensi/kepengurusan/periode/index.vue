<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <periode-table />
      </div>
    </div>
  </div>
</template>

<script>
import PeriodeTable from "./PeriodeTable.vue";

export default {
  components: {
    PeriodeTable,
  },
};
</script>
