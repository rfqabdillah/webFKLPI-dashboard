<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <officials-table />
            </div>
        </div>

    </div>
</template>

<script>
import OfficialsTable from './OfficialsTable.vue';

export default {
    components: {
        OfficialsTable,
    }
}
</script>
