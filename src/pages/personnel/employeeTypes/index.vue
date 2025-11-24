<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <employee-types-table />
            </div>
        </div>

    </div>
</template>

<script>
import EmployeeTypesTable from './EmployeeTypesTable.vue';

export default {
    components: {
        EmployeeTypesTable,
    }
}
</script>
