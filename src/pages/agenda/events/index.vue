<template>
    <div>
        <Breadcrumbs main="Agenda" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <events-table />
            </div>
        </div>

    </div>
</template>

<script>
import EventsTable from './EventsTable.vue';

export default {
    components: {
        EventsTable,
    }
}
</script>
