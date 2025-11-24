<template>
  <div>
    <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <employments-table />
      </div>
    </div>
  </div>
</template>

<script>
import EmploymentsTable from "./EmploymentsTable.vue";

export default {
  components: {
    EmploymentsTable,
  },
};
</script>
