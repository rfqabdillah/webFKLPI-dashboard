<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <measurement-books-table />
            </div>
        </div>

    </div>
</template>

<script>
import MeasurementBooksTable from './MeasurementBooksTable.vue';

export default {
    components: {
        MeasurementBooksTable,
    }
}
</script>
