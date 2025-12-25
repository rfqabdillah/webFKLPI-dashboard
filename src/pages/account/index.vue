<template>
  <div>
    <Breadcrumbs :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <AccountPage />
      </div>
    </div>
  </div>
</template>

<script>
import AccountPage from "./AccountPage.vue";

export default {
  components: {
    AccountPage,
  },
};
</script>
