<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <announcements-table />
            </div>
        </div>

    </div>
</template>

<script>
import AnnouncementsTable from './AnnouncementsTable.vue';

export default {
    components: {
        AnnouncementsTable,
    }
}
</script>
