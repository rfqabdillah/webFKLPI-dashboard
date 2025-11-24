<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <photo-gallery-table />
            </div>
        </div>

    </div>
</template>

<script>
import PhotoGalleryTable from './PhotoGalleryTable.vue';

export default {
    components: {
        PhotoGalleryTable,
    }
}
</script>
