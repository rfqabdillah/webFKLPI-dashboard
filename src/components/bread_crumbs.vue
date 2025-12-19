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
      pageBodyWidth: null,
    };
  },
  computed: {
    pageTitleStyle() {
      if (this.pageBodyWidth) {
        return {
          width: `${this.pageBodyWidth}px`,
          maxWidth: `${this.pageBodyWidth}px`,
        };
      }
      return {
        width: "100%",
        maxWidth: "100%",
      };
    },
  },
  mounted() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  },
  methods: {
    updateWidth() {
      const pageBody = document.querySelector(".page-body");
      if (pageBody) {
        this.pageBodyWidth = pageBody.offsetWidth;
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
