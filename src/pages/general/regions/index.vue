<template>
    <div>
        <Breadcrumbs main="Umum" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <regions-table />
            </div>
        </div>

    </div>
</template>

<script>
import RegionsTable from './RegionsTable.vue';

export default {
    components: {
        RegionsTable,
    }
}
</script>
