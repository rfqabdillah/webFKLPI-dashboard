<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <banners-table />
            </div>
        </div>

    </div>
</template>

<script>
import BannersTable from './BannersTable.vue';

export default {
    components: {
        BannersTable,
    }
}
</script>
