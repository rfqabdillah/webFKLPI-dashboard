<template>
  <div>
    <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <scale-table />
      </div>
    </div>
  </div>
</template>

<script>
import ScaleTable from "./ScaleTable.vue";

export default {
  components: {
    ScaleTable,
  },
};
</script>
