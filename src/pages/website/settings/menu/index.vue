<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <menus-table />
            </div>
        </div>

    </div>
</template>

<script>
import MenusTable from './MenusTable.vue';

export default {
    components: {
        MenusTable,
    }
}
</script>
