<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <banner-table />
      </div>
    </div>
  </div>
</template>

<script>
import BannerTable from "./BannerTable.vue";

export default {
  components: {
    BannerTable,
  },
};
</script>
