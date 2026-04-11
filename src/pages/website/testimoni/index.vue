<template>
  <div>
    <Breadcrumbs main="Testimoni" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <TestimoniTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "@/components/bread_crumbs.vue";
import TestimoniTable from "./TestimoniTable.vue";
</script>
