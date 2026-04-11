<template>
  <div>
    <Breadcrumbs :title="$route.meta.title" />

    <div class="container-fluid">
      <div class="row widget-grid">
        <div class="col-xxl-12 col-sm-12 box-col-12">
          <WelcomeCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomeCard from "./WelcomeCard.vue";

export default {
  components: {
    WelcomeCard,
  },
};
</script>
