<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <position-levels-table />
            </div>
        </div>

    </div>
</template>

<script>
import PositionLevelsTable from './PositionLevelsTable.vue';

export default {
    components: {
        PositionLevelsTable,
    }
}
</script>
