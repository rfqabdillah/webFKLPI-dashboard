<template>
  <div>
    <Breadcrumbs main="Umum" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <user-profile />
      </div>
    </div>
  </div>
</template>

<script>
import UserProfile from "./userProfile.vue";

export default {
  components: {
    UserProfile,
  },
};
</script>
