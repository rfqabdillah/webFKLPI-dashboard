<template>
  <div>
    <Breadcrumbs :title="$route.meta.title" />

    <div class="container-fluid">
      <div class="row widget-grid">
        <div class="col-xxl-8 col-sm-6 box-col-6">
          <div class="row mb-4">
            <div class="col-lg-4 col-md-5 box-col-4">
              <ProfileCard />
            </div>
            <div class="col-lg-8 col-md-7 box-col-8">
              <GreetingCard />
            </div>
          </div>
          <InfoCard />
          <StatistikPerusahaanCard />
        </div>
        <div class="col-xxl-4 col-sm-6 box-col-6">
          <MouCard />
          <CalendarCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileCard from "./ProfileCard.vue";
import GreetingCard from "./greetingCard.vue";
import InfoCard from "./InfoCard.vue";
import StatistikPerusahaanCard from "./StatistikPerusahaanCard.vue";
import CalendarCard from "./CalendarCard.vue";
import MouCard from "./MouCard.vue";

export default {
  components: {
    ProfileCard,
    GreetingCard,
    InfoCard,
    StatistikPerusahaanCard,
    CalendarCard,
    MouCard,
  },
};
</script>
