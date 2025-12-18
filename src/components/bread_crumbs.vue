<template>
  <div class="page-title" :style="pageTitleStyle">
    <div class="row">
      <div class="col-6">
        <h3 v-if="main" class="page-main-title">{{ main }}</h3>
      </div>
      <div class="col-6">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="/api/api"><i class="fa fa-home"></i></a>
          </li>
          <li v-if="main" class="breadcrumb-item">{{ main }}</li>
          <li class="breadcrumb-item active breadcrumb-title">{{ title }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    main: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      layoutWidth: "1320px", // default for Los Angeles
    };
  },
  computed: {
    pageTitleStyle() {
      return {
        width: this.layoutWidth,
        maxWidth: this.layoutWidth,
      };
    },
  },
  mounted() {
    this.detectLayout();
  },
  methods: {
    detectLayout() {
      const pageWrapper = document.querySelector(".page-wrapper");
      if (pageWrapper) {
        if (pageWrapper.classList.contains("compact-wrapper")) {
          // Dubai layout
          this.layoutWidth = "1430px";
        } else if (pageWrapper.classList.contains("horizontal-wrapper")) {
          // Los Angeles layout
          this.layoutWidth = "1320px";
        }
      }
    },
  },
};
</script>

<style scoped>
.page-title {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box;
}

.page-main-title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breadcrumb-title {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}
</style>
