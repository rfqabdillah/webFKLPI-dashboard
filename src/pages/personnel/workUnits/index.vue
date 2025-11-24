<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <work-units-table />
            </div>
        </div>

    </div>
</template>

<script>
import WorkUnitsTable from './WorkUnitsTable.vue';

export default {
    components: {
        WorkUnitsTable,
    }
}
</script>
