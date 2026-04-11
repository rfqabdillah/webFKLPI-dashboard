<template>
  <div>
    <Breadcrumbs main="Website" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <faq-table />
      </div>
    </div>
  </div>
</template>

<script>
import FaqTable from "./FaqTable.vue";

export default {
  components: {
    FaqTable,
  },
};
</script>
