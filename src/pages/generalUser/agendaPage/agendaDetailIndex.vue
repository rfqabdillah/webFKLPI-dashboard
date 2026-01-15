<template>
  <div>
    <Breadcrumbs main="Events" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <AgendaDetailPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "@/components/bread_crumbs.vue";
import AgendaDetailPage from "./AgendaDetailPage.vue";
</script>
