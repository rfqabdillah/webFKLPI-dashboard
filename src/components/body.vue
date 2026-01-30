<template>
  <div class="loader-wrapper" v-if="loading">
    <div class="loader-index"><span></span></div>
    <svg>
      <defs></defs>
      <filter id="goo">
        <fegaussianblur
          in="SourceGraphic"
          stddeviation="11"
          result="blur"
        ></fegaussianblur>
        <fecolormatrix
          in="blur"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
          result="goo"
        ></fecolormatrix>
      </filter>
    </svg>
  </div>
  <div v-else>
    <div class="page-wrapper" id="pageWrapper" :class="layoutobj">
      <div class="page-header" :class="{ close_icon: !togglesidebar }">
        <Header @clicked="sidebar_toggle" />
      </div>

      <div class="page-body-wrapper">
        <div
          class="sidebar-wrapper"
          :class="[{ close_icon: !togglesidebar }]"
          :sidebar-layout="svg == 'stroke-svg' ? 'stroke-svg' : 'fill-svg'"
        >
          <Sidebar @clicked="sidebar_toggle" />
        </div>
        <div class="page-body" @click="hidesecondmenu()">
          <router-view v-slot="{ Component }">
            <transition name="fadeIn" enter-active-class="animated fadeIn">
              <component :is="Component" class="view" />
            </transition>
          </router-view>
        </div>
        <Footer />
      </div>
      <!-- <Customizer/> -->
      <TapTop />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import { layoutClasses } from "../constants/layout";
import { userLevelUmum } from "../constants/userLevels";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer.vue";
import TapTop from "./tapTop.vue";

const getUserLevelFromStorage = () => {
  try {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData?.data?.[0]?.id_level) {
        return userData.data[0].id_level;
      }
      if (userData?.data?.[0]?.roles?.id_level) {
        return userData.data[0].roles.id_level;
      }
    }
  } catch (error) {
    console.error("Error getting user level:", error);
  }
  return null;
};

// Helper function
const getLayoutForUserLevel = () => {
  const userLevel = getUserLevelFromStorage();

  if (userLevel === userLevelUmum) {
    return "LosAngeles";
  }

  return "Dubai";
};

export default {
  props: ["sidebar_toggle_var"],
  components: {
    Header,
    Sidebar,
    Footer,
    // Customizer,
    TapTop,
  },
  data() {
    return {
      loading: true,
      mobileheader_toggle_var: false,
      sidebar_toggle_var: false,
      horizontal_Sidebar: true,
      resized: false,
      layoutobj: {},
    };
  },
  computed: {
    ...mapState({
      menuItems: (state) => state.menu.data,
      layout: (state) => state.layout.layout,
      togglesidebar: (state) => state.menu.togglesidebar,
      activeoverlay: (state) => state.menu.activeoverlay,
      svg: (state) => state.layout.svg,
    }),
    ...mapGetters({
      sidebar: "layout/sidebar",
    }),
    layoutobject: {
      get: function () {
        // return 'hello'
        return JSON.parse(
          JSON.stringify(
            layoutClasses.find(
              (item) => Object.keys(item).pop() === this.layout.settings.layout,
            ),
          ),
        )[this.layout.settings.layout];
      },
      set: function () {
        this.layoutobj = layoutClasses.find(
          (item) => Object.keys(item).pop() === this.layout.settings.layout,
        );
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
        return this.layoutobj;
      },
    },
  },
  watch: {
    $route() {
      setTimeout(() => {
        this.loading = !this.loading;
      }, 3000);
      this.loading = !this.loading;
      this.menuItems.filter((items) => {
        if (items.path === this.$route.path)
          this.$store.dispatch("menu/setActiveRoute", items);
        if (!items.children) return false;
        items.children.filter((subItems) => {
          if (subItems.path === this.$route.path)
            this.$store.dispatch("menu/setActiveRoute", subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path === this.$route.path)
              this.$store.dispatch("menu/setActiveRoute", subSubItems);
          });
        });
      });

      this.ensureCorrectLayoutForUser();
      this.checkResponsiveLayout();
    },
    sidebar_toggle_var: function () {
      this.resized =
        this.width <= 991 ? !this.sidebar_toggle_var : this.sidebar_toggle_var;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.resized = this.sidebar_toggle_var;
    this.$store.dispatch("layout/set");

    window.addEventListener("userDataUpdated", this.handleUserDataChange);
    window.addEventListener("storage", this.handleStorageChange);

    const defaultLayout = getLayoutForUserLevel();

    this.layout.settings.layout = this.$route.query.layout
      ? this.$route.query.layout
      : defaultLayout;

    this.layoutobj = layoutClasses.find(
      (item) => Object.keys(item).pop() === this.layout.settings.layout,
    );
    this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
      this.layout.settings.layout
    ];
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("userDataUpdated", this.handleUserDataChange);
    window.removeEventListener("storage", this.handleStorageChange);
  },
  methods: {
    sidebar_toggle(value) {
      this.sidebar_toggle_var = !value;
    },
    mobiletoggle_toggle(value) {
      this.mobileheader_toggle_var = value;
    },
    handleResize() {
      this.$store.dispatch("menu/resizetoggle");
      this.checkResponsiveLayout();
    },
    checkResponsiveLayout() {
      this.layoutobj = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout,
      );

      if (
        (window.innerWidth < 992 &&
          this.layout.settings.layout === "LosAngeles") ||
        (window.innerWidth < 992 &&
          this.layout.settings.layout === "Singapore") ||
        (window.innerWidth < 992 && this.layout.settings.layout === "Barcelona")
      ) {
        const newlayout = JSON.parse(
          JSON.stringify(this.layoutobj).replace(
            "horizontal-wrapper",
            "compact-wrapper",
          ),
        );

        this.layoutobj = JSON.parse(JSON.stringify(newlayout))[
          this.layout.settings.layout
        ];
      } else {
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
      }
    },
    ensureCorrectLayoutForUser() {
      const expectedLayout = getLayoutForUserLevel();
      const currentLayout = this.layout.settings.layout;

      if (currentLayout === expectedLayout) {
        this.checkResponsiveLayout(); // Ensure responsive check runs
        return;
      }

      this.layout.settings.layout = expectedLayout;
      this.updateLayoutObject();
      this.checkResponsiveLayout(); // Ensure responsive check runs
    },
    handleUserDataChange() {
      this.ensureCorrectLayoutForUser();
    },
    handleStorageChange(e) {
      if (e.key === "userData") {
        this.ensureCorrectLayoutForUser();
      }
    },
    updateLayoutObject() {
      this.layoutobj = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout,
      );
      if (this.layoutobj) {
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
      }
    },
    removeoverlay() {
      this.$store.state.menu.activeoverlay = false;
      if (window.innerWidth < 992) {
        this.$store.state.menu.togglesidebar = false;
      }
      this.menuItems.filter((menuItem) => {
        menuItem.active = false;
      });
    },
    hidesecondmenu() {
      if (this.layoutobject.split(" ").includes("compact-sidebar")) {
        this.menuItems.filter((menuItem) => {
          menuItem.active = false;
        });
      }
      if (window.innerWidth < 992) {
        this.$store.state.menu.togglesidebar = false;
      }
    },
  },
  mounted() {
    this.loading = false;
    this.ensureCorrectLayoutForUser();
  },
};
</script>
