<template>
  <div>
    <Breadcrumbs main="Program Pelatihan" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <program-pelatihan-table />
      </div>
    </div>
  </div>
</template>

<script>
import ProgramPelatihanTable from "./ProgramPelatihanTable.vue";

export default {
  components: {
    ProgramPelatihanTable,
  },
};
</script>
