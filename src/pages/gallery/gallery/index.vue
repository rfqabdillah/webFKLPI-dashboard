<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <gallery-table />
            </div>
        </div>

    </div>
</template>

<script>
import GalleryTable from './GalleryTable.vue';

export default {
    components: {
        GalleryTable,
    }
}
</script>
