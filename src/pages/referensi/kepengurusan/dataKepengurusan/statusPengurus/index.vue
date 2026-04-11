<template>
  <div>
    <Breadcrumbs main="Kepengurusan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <status-pengurus-table />
      </div>
    </div>
  </div>
</template>

<script>
import StatusPengurusTable from "./StatusPengurusTable.vue";

export default {
  components: {
    StatusPengurusTable,
  },
};
</script>
