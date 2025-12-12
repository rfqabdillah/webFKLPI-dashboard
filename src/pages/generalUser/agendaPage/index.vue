<template>
  <div>
    <Breadcrumbs :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <agenda-page />
      </div>
    </div>
  </div>
</template>

<script>
import AgendaPage from "./AgendaPage.vue";

export default {
  components: {
    AgendaPage,
  },
};
</script>
