<template>
  <div
    class="skeleton"
    :class="[variant, { shimmer: animated }]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "text",
    validator: (v) =>
      [
        "text",
        "heading",
        "avatar",
        "thumbnail",
        "card",
        "button",
        "badge",
        "custom",
      ].includes(v),
  },
  width: { type: String, default: null },
  height: { type: String, default: null },
  rounded: { type: [String, Boolean], default: null },
  animated: { type: Boolean, default: true },
});

const customStyle = computed(() => {
  const style = {};
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  if (props.rounded === true) style.borderRadius = "50%";
  else if (props.rounded) style.borderRadius = props.rounded;
  return style;
});
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.skeleton.shimmer {
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
.skeleton.text {
  height: 16px;
  width: 100%;
  border-radius: 4px;
}
.skeleton.heading {
  height: 24px;
  width: 60%;
  border-radius: 4px;
}
.skeleton.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.skeleton.thumbnail {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}
.skeleton.card {
  width: 100%;
  height: 200px;
  border-radius: 12px;
}
.skeleton.button {
  width: 120px;
  height: 40px;
  border-radius: 6px;
}
.skeleton.badge {
  width: 80px;
  height: 24px;
  border-radius: 12px;
}
.skeleton.custom {
  border-radius: 4px;
}
</style>
