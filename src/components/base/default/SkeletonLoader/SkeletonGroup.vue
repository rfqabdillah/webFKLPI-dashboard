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

    <!-- Form Card Skeleton (for Account Tabs) -->
    <template v-else-if="type === 'form-card'">
      <div class="form-card-skeleton">
        <!-- Header -->
        <div
          class="form-header-skeleton d-flex justify-content-between align-items-center mb-3"
        >
          <div>
            <BaseSkeleton variant="text" width="180px" height="20px" />
            <BaseSkeleton
              variant="text"
              width="250px"
              height="14px"
              class="mt-1"
            />
          </div>
          <BaseSkeleton variant="button" width="120px" />
        </div>

        <!-- Cards -->
        <div v-for="n in count" :key="n" class="card-item-skeleton mb-3">
          <div
            class="card-header-skeleton d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center gap-2">
              <BaseSkeleton variant="badge" width="30px" height="24px" />
              <BaseSkeleton variant="text" width="120px" />
            </div>
            <BaseSkeleton
              variant="custom"
              width="32px"
              height="32px"
              rounded="4px"
            />
          </div>
          <div class="card-body-skeleton">
            <div class="row g-3">
              <div class="col-md-6">
                <BaseSkeleton variant="text" width="80px" height="14px" />
                <BaseSkeleton
                  variant="custom"
                  width="100%"
                  height="38px"
                  rounded="6px"
                  class="mt-1"
                />
              </div>
              <div class="col-md-6">
                <BaseSkeleton variant="text" width="100px" height="14px" />
                <BaseSkeleton
                  variant="custom"
                  width="100%"
                  height="38px"
                  rounded="6px"
                  class="mt-1"
                />
              </div>
              <div class="col-md-6">
                <BaseSkeleton variant="text" width="90px" height="14px" />
                <BaseSkeleton
                  variant="custom"
                  width="100%"
                  height="38px"
                  rounded="6px"
                  class="mt-1"
                />
              </div>
              <div class="col-md-6">
                <BaseSkeleton variant="text" width="70px" height="14px" />
                <BaseSkeleton
                  variant="custom"
                  width="100%"
                  height="38px"
                  rounded="6px"
                  class="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- List Card Skeleton (New) -->
    <template v-else-if="type === 'list-card'">
      <div v-for="n in count" :key="n" class="card mb-2 shadow-sm border">
        <div class="card-body py-3 px-4">
          <div class="d-flex align-items-start">
            <!-- Icon Box -->
            <div class="flex-shrink-0 me-3">
              <BaseSkeleton
                variant="custom"
                width="42px"
                height="42px"
                rounded="8px"
              />
            </div>
            <!-- Content -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <BaseSkeleton variant="text" width="150px" height="16px" />
                  <BaseSkeleton
                    variant="text"
                    width="200px"
                    height="14px"
                    class="mt-2"
                  />
                  <BaseSkeleton
                    variant="button"
                    width="100px"
                    height="28px"
                    class="mt-2"
                  />
                </div>
                <!-- Status Badge -->
                <BaseSkeleton variant="badge" width="80px" height="24px" />
              </div>
            </div>
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
        "list-card",
        "testimonial",
        "form-card",
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

/* Form Card Skeleton Styles */
.form-card-skeleton {
  padding: 10px 0;
}

.card-item-skeleton {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header-skeleton {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-body-skeleton {
  padding: 20px;
}
</style>
