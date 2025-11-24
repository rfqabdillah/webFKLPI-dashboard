<template>
    <div>
        <Breadcrumbs main="Umum" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <users-table />
            </div>
        </div>

    </div>
</template>

<script>
import UsersTable from './usersTable.vue';

export default {
    components: {
        UsersTable,
    }
}
</script>
