<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <videos-table />
            </div>
        </div>

    </div>
</template>

<script>
import VideosTable from './VideosTable.vue';

export default {
    components: {
        VideosTable,
    }
}
</script>
