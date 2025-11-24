<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <document-types-table />
            </div>
        </div>

    </div>
</template>

<script>
import DocumentTypesTable from './DocumentTypesTable.vue';

export default {
    components: {
        DocumentTypesTable,
    }
}
</script>
