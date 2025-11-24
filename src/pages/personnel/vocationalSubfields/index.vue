<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <vocational-subfields-table />
            </div>
        </div>

    </div>
</template>

<script>
import VocationalSubfieldsTable from './VocationalSubfieldsTable.vue';

export default {
    components: {
        VocationalSubfieldsTable,
    }
}
</script>
