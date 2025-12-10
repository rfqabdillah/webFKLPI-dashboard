<template>
  <div>
    <Breadcrumbs main="Profil Saya" :title="$route.meta.title" />
    <div class="container-fluid">
      <div class="row">
        <user-profile />
      </div>
    </div>
  </div>
</template>

<script>
import UserProfile from "./UserProfile.vue";

export default {
  components: {
    UserProfile,
  },
};
</script>
