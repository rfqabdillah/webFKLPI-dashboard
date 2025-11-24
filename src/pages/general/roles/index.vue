<template>
    <div>
        <Breadcrumbs main="Umum" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <RolesTable />
            </div>
        </div>

    </div>
</template>

<script>
import RolesTable from './rolesTable.vue';

export default {
    components: {
        RolesTable,
    }
}
</script>
