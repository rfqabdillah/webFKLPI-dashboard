<template>
  <div>
    <Breadcrumbs :main="$route.meta.title" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <MyAgendaPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "@/components/bread_crumbs.vue";
import MyAgendaPage from "./MyAgendaPage.vue";
</script>
