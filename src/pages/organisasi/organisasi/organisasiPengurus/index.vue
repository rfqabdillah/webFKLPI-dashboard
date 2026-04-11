<template>
  <div>
    <Breadcrumbs main="Organisasi" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <organisasi-pengurus-table />
      </div>
    </div>
  </div>
</template>

<script>
import OrganisasiPengurusTable from "./OrganisasiPengurusTable.vue";

export default {
  components: {
    OrganisasiPengurusTable,
  },
};
</script>
