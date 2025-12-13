<template>
  <div>
    <Breadcrumbs main="Testimoni" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <TestimoniPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "@/components/bread_crumbs.vue";
import TestimoniPage from "./TestimoniPage.vue";
</script>
