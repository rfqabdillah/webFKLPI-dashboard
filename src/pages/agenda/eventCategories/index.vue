<template>
    <div>
        <Breadcrumbs main="Agenda" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <event-categories-table />
            </div>
        </div>

    </div>
</template>

<script>
import EventCategoriesTable from './EventCategoriesTable.vue';

export default {
    components: {
        EventCategoriesTable,
    }
}
</script>
