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
    <!-- <div class="page-wrapper" id="pageWrapper" :class="{'horizontal-wrapper':sidebar=='horizontal-wrapper','compact-wrapper':sidebar=='compact-sidebar1'}"> -->
    <div class="page-wrapper" id="pageWrapper" :class="layoutobj">
      <div class="page-header" :class="{ close_icon: !togglesidebar }">
        <Header @clicked="sidebar_toggle" />
      </div>

      <div class="page-body-wrapper">
        <!-- <div class="bg-overlay" :class="{active: activeoverlay }" @click="removeoverlay()"></div> -->
        <div
          class="sidebar-wrapper"
          :class="[{ close_icon: !togglesidebar }]"
          :sidebar-layout="svg == 'stroke-svg' ? 'stroke-svg' : 'fill-svg'"
        >
          <Sidebar @clicked="sidebar_toggle" />
        </div>
        <div class="page-body" @click="hidesecondmenu()">
          <transition name="fadeIn" enter-active-class="animated fadeIn">
            <router-view class="view"></router-view>
          </transition>
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
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer.vue";
// import Customizer from './customizer';
import TapTop from "./tapTop.vue";

// Constants for user levels
const UMUM_LEVEL_ID = "01729723-6880-4c3c-ab67-d7f3a4424482";

// Helper function to get user id_level from localStorage
const getUserLevelFromStorage = () => {
  try {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      // Try to get from direct property
      if (userData?.data?.[0]?.id_level) {
        return userData.data[0].id_level;
      }
      // Try to get from roles object
      if (userData?.data?.[0]?.roles?.id_level) {
        return userData.data[0].roles.id_level;
      }
    }
  } catch (error) {
    console.error("Error getting user level:", error);
  }
  return null;
};

// Helper function to determine layout based on user level
const getLayoutForUserLevel = () => {
  const userLevel = getUserLevelFromStorage();

  // User "umum" uses Los Angeles layout (horizontal navbar/topbar)
  if (userLevel === UMUM_LEVEL_ID) {
    return "LosAngeles";
  }

  // Other users (administrator, operator) use Dubai layout (vertical sidebar)
  return "Dubai";
};

export default {
  //   name: 'mainPage',
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
              (item) => Object.keys(item).pop() === this.layout.settings.layout
            )
          )
        )[this.layout.settings.layout];
      },
      set: function () {
        this.layoutobj = layoutClasses.find(
          (item) => Object.keys(item).pop() === this.layout.settings.layout
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

      // IMPORTANT: Enforce correct layout based on user level on every route change
      // This prevents "umum" users from accidentally getting Dubai layout
      this.ensureCorrectLayoutForUser();

      this.layoutobj = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout
      );
      console.log("layobj==>", this.layoutobj);

      if (
        (window.innerWidth < 991 &&
          this.layout.settings.layout === "LosAngeles") ||
        (window.innerWidth < 991 &&
          this.layout.settings.layout === "Singapore") ||
        (window.innerWidth < 991 && this.layout.settings.layout === "Barcelona")
      ) {
        const newlayout = JSON.parse(
          JSON.stringify(this.layoutobj).replace(
            "horizontal-wrapper",
            "compact-wrapper"
          )
        );
        // console.log("newlayobj==>",newlayout)

        this.layoutobj = JSON.parse(JSON.stringify(newlayout))[
          this.layout.settings.layout
        ];
      } else {
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
      }
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

    // Listen for user data changes (login/logout/profile update)
    // to ensure layout is updated accordingly
    window.addEventListener("userDataUpdated", this.handleUserDataChange);
    window.addEventListener("storage", this.handleStorageChange);

    // Determine layout based on user level (umum uses LosAngeles, admin/operator uses Dubai)
    const defaultLayout = getLayoutForUserLevel();

    // Use query param if provided, otherwise use dynamic layout based on user level
    this.layout.settings.layout = this.$route.query.layout
      ? this.$route.query.layout
      : defaultLayout;

    this.layoutobj = layoutClasses.find(
      (item) => Object.keys(item).pop() === this.layout.settings.layout
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
    },
    // Method to ensure layout matches user level
    // "umum" users should always have LosAngeles layout
    // Other users (admin, operator) should have Dubai layout
    ensureCorrectLayoutForUser() {
      const expectedLayout = getLayoutForUserLevel();
      const currentLayout = this.layout.settings.layout;

      // Skip if layout is already correct
      if (currentLayout === expectedLayout) {
        return;
      }

      // Force correct layout based on user level
      console.log(
        `[Layout] Correcting layout from ${currentLayout} to ${expectedLayout}`
      );
      this.layout.settings.layout = expectedLayout;

      // Update layoutobj to reflect the change
      this.updateLayoutObject();
    },
    // Handler for userDataUpdated event (same tab)
    handleUserDataChange() {
      console.log("[Layout] User data changed, checking layout...");
      this.ensureCorrectLayoutForUser();
    },
    // Handler for storage event (other tabs)
    handleStorageChange(e) {
      if (e.key === "userData") {
        console.log(
          "[Layout] User data changed in another tab, checking layout..."
        );
        this.ensureCorrectLayoutForUser();
      }
    },
    // Update layoutobj based on current layout setting
    updateLayoutObject() {
      this.layoutobj = layoutClasses.find(
        (item) => Object.keys(item).pop() === this.layout.settings.layout
      );
      if (this.layoutobj) {
        this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[
          this.layout.settings.layout
        ];
      }
    },
    removeoverlay() {
      this.$store.state.menu.activeoverlay = false;
      if (window.innerWidth < 991) {
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
      if (window.innerWidth < 991) {
        this.$store.state.menu.togglesidebar = false;
      }
    },
  },
  mounted() {
    // setTimeout(()=>{
    this.loading = false;

    // Ensure layout is correct after mount
    // This catches any edge cases where layout was set incorrectly
    this.ensureCorrectLayoutForUser();
    // },2000)
  },
};
</script>
