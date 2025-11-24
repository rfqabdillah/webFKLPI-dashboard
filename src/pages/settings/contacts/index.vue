<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <application-settings />
            </div>
        </div>

    </div>
</template>

<script>
import ApplicationSettings from './ApplicationSettings.vue';

export default {
    components: {
        ApplicationSettings,
    }
}
</script>
