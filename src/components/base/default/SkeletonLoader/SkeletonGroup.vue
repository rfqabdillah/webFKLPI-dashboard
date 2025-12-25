<template>
  <div class="skeleton-group">
    <!-- Profile Card Skeleton -->
    <template v-if="type === 'profile-card'">
      <div class="profile-card-skeleton">
        <div class="banner-skeleton shimmer"></div>
        <div class="profile-content">
          <BaseSkeleton
            variant="custom"
            width="120px"
            height="120px"
            :rounded="true"
          />
          <BaseSkeleton variant="heading" width="150px" class="mt-3" />
          <BaseSkeleton variant="text" width="100px" class="mt-2" />
          <BaseSkeleton variant="badge" class="mt-2" />
        </div>
      </div>
    </template>

    <!-- Tab Content Skeleton -->
    <template v-else-if="type === 'tab-content'">
      <div class="tab-nav-skeleton mb-4">
        <BaseSkeleton v-for="n in tabCount" :key="n" variant="button" />
      </div>
      <div class="card-skeleton">
        <BaseSkeleton variant="text" width="80%" />
        <BaseSkeleton variant="text" width="100%" class="mt-2" />
        <BaseSkeleton variant="text" width="60%" class="mt-2" />
      </div>
    </template>

    <!-- List Skeleton -->
    <template v-else-if="type === 'list'">
      <div class="list-item-skeleton" v-for="n in count" :key="n">
        <BaseSkeleton variant="avatar" />
        <div class="list-item-text">
          <BaseSkeleton variant="text" width="70%" />
          <BaseSkeleton variant="text" width="50%" height="12px" class="mt-1" />
        </div>
      </div>
    </template>

    <!-- Testimonial Skeleton -->
    <template v-else-if="type === 'testimonial'">
      <div class="testimonial-skeleton">
        <div class="stars-skeleton mb-3">
          <BaseSkeleton
            v-for="n in 5"
            :key="n"
            variant="custom"
            width="32px"
            height="32px"
            rounded="4px"
          />
        </div>
        <BaseSkeleton
          variant="custom"
          width="100%"
          height="150px"
          rounded="12px"
        />
        <div class="user-skeleton mt-4">
          <BaseSkeleton variant="avatar" />
          <div class="user-text">
            <BaseSkeleton variant="text" width="120px" />
            <BaseSkeleton
              variant="text"
              width="180px"
              height="12px"
              class="mt-1"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Default -->
    <template v-else>
      <BaseSkeleton
        variant="text"
        v-for="n in count"
        :key="n"
        :class="{ 'mt-2': n > 1 }"
      />
    </template>
  </div>
</template>

<script setup>
import BaseSkeleton from "./BaseSkeleton.vue";

defineProps({
  type: {
    type: String,
    default: "generic",
    validator: (v) =>
      [
        "profile-card",
        "tab-content",
        "list",
        "testimonial",
        "generic",
      ].includes(v),
  },
  count: { type: Number, default: 3 },
  tabCount: { type: Number, default: 6 },
});
</script>

<style scoped>
.skeleton-group {
  width: 100%;
}
.profile-card-skeleton {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.banner-skeleton {
  height: 100px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.shimmer {
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.profile-content {
  padding: 20px;
  text-align: center;
  margin-top: -60px;
}
.tab-nav-skeleton {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.card-skeleton {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.list-item-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.list-item-text {
  flex: 1;
}
.testimonial-skeleton {
  padding: 20px;
}
.stars-skeleton {
  display: flex;
  gap: 8px;
}
.user-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-text {
  flex: 1;
}
</style>
