<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <news-table />
            </div>
        </div>

    </div>
</template>

<script>
import NewsTable from './NewsTable.vue';

export default {
    components: {
        NewsTable,
    }
}
</script>
