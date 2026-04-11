<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <profesi-table />
      </div>
    </div>
  </div>
</template>

<script>
import ProfesiTable from "./ProfesiTable.vue";

export default {
  components: {
    ProfesiTable,
  },
};
</script>
