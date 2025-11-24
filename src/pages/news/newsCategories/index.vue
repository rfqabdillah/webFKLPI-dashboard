<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <news-categories-table />
            </div>
        </div>

    </div>
</template>

<script>
import NewsCategoriesTable from './NewsCategoriesTable.vue';

export default {
    components: {
        NewsCategoriesTable,
    }
}
</script>
