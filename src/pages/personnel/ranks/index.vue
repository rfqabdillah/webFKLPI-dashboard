<template>
    <div>
        <Breadcrumbs main="Agenda" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ranks-table />
            </div>
        </div>

    </div>
</template>

<script>
import RanksTable from './RanksTable.vue';

export default {
    components: {
        RanksTable,
    }
}
</script>
