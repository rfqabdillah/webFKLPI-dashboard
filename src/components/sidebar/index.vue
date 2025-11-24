<template>
  <div>
    <div class="logo-wrapper">
      <Logo />
      <div class="back-btn" @click="toggle_sidebar">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="toggle-sidebar" @click="toggle_sidebar">
        <vue-feather
          class="status_toggle middle sidebar-toggle"
          type="grid"
          id="sidebar-toggle"
        ></vue-feather>
      </div>
    </div>

    <div class="logo-icon-wrapper">
      <Logo />
    </div>

    <Nav />
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import Logo from './logo.vue';
import Nav from './nav.vue';

const store = useStore();

function toggle_sidebar() {
  store.dispatch('menu/opensidebar');
  store.state.menu.activeoverlay = false;
}
</script>