<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <vocational-fields-table />
            </div>
        </div>

    </div>
</template>

<script>
import VocationalFieldsTable from './VocationalFieldsTable.vue';

export default {
    components: {
        VocationalFieldsTable,
    }
}
</script>
