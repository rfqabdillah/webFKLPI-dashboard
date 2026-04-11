<template>
  <div>
    <Breadcrumbs main="Agenda" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <kategori-agenda-table />
      </div>
    </div>
  </div>
</template>

<script>
import KategoriAgendaTable from "./KategoriAgendaTable.vue";

export default {
  components: {
    KategoriAgendaTable,
  },
};
</script>
