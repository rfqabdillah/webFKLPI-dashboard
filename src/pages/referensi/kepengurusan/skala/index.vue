<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <skala-table />
      </div>
    </div>
  </div>
</template>

<script>
import SkalaTable from "./SkalaTable.vue";

export default {
  components: {
    SkalaTable,
  },
};
</script>
