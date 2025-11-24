<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <pages-table />
            </div>
        </div>

    </div>
</template>

<script>
import PagesTable from './PagesTable.vue';

export default {
    components: {
        PagesTable,
    }
}
</script>
