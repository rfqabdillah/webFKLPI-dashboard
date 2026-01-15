<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <video-categories-table />
      </div>
    </div>
  </div>
</template>

<script>
import VideoCategoriesTable from "./VideoCategoriesTable.vue";

export default {
  components: {
    VideoCategoriesTable,
  },
};
</script>
