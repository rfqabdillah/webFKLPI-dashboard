<template>
  <div class="page-title">
    <div class="row">
      <div class="col-6">
        <h3 v-if="main">{{ main }}</h3>
      </div>
      <div class="col-6">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="/api/api"><i class="fa fa-home"></i></a>
          </li>
          <li v-if="main" class="breadcrumb-item">{{ main }}</li>
          <li class="breadcrumb-item active">{{ title }}</li>
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
        default: ''
      },
      main: {
        type: String,
        default: ''
      }
    }
  };
</script>