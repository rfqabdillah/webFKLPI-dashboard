<template>
  <div>
    <Breadcrumbs main="Organisasi" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <organisasi-periode-table />
      </div>
    </div>
  </div>
</template>

<script>
import OrganisasiPeriodeTable from "./OrganisasiPeriodeTable.vue";

export default {
  components: {
    OrganisasiPeriodeTable,
  },
};
</script>
