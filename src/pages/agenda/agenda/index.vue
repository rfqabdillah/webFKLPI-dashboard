<template>
  <div>
    <Breadcrumbs main="Agenda" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <agenda-table />
      </div>
    </div>
  </div>
</template>

<script>
import AgendaTable from "./AgendaTable.vue";

export default {
  components: {
    AgendaTable,
  },
};
</script>
