<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <employee-statuses-table />
            </div>
        </div>

    </div>
</template>

<script>
import EmployeeStatusesTable from './EmployeeStatusesTable.vue';

export default {
    components: {
        EmployeeStatusesTable,
    }
}
</script>
