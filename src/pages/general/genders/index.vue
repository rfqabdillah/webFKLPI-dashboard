<template>
  <div>
    <Breadcrumbs main="Umum" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <genders-table />
      </div>
    </div>
  </div>
</template>

<script>
import GendersTable from "./GendersTable.vue";

export default {
  components: {
    GendersTable,
  },
};
</script>
