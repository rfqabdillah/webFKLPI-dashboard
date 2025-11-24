<template>
  <div>
    <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <level-categories-table />
      </div>
    </div>
  </div>
</template>

<script>
import LevelCategoriesTable from "./LevelCategoriesTable.vue";

export default {
  components: {
    LevelCategoriesTable,
  },
};
</script>
