<template>
  <div>
    <Breadcrumbs main="Umum" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <user-types-table />
      </div>
    </div>
  </div>
</template>

<script>
import UserTypesTable from "./UserTypesTable.vue";

export default {
  components: {
    UserTypesTable,
  },
};
</script>
