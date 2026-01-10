<template>
  <div>
    <Breadcrumbs :title="$route.meta.title" />

    <div class="container-fluid">
      <div class="row widget-grid">
        <div class="col-xxl-8 col-sm-6 box-col-6">
          <GreetingCard />
          <InfoCard />
          <AgendaStatisticsCard />
          <PerformanceChartCard />
        </div>
        <div class="col-xxl-4 col-sm-6 box-col-6">
          <CalendarCard />
          <OnlineLogCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarCard from "./CalendarCard.vue";
import GreetingCard from "./greetingCard.vue";
import InfoCard from "./InfoCard.vue";
import OnlineLogCard from "./OnlineLogCard.vue";
import AgendaStatisticsCard from "./AgendaStasticsCard.vue";
import PerformanceChartCard from "./PerformanceChartCard.vue";

export default {
  components: {
    GreetingCard,
    CalendarCard,
    InfoCard,
    OnlineLogCard,
    AgendaStatisticsCard,
    PerformanceChartCard,
  },
};
</script>
