<template>
    <div>
        <Breadcrumbs main="Kepegawaian" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <education-levels-table />
            </div>
        </div>

    </div>
</template>

<script>
import EducationLevelsTable from './EducationLevelsTable.vue';

export default {
    components: {
        EducationLevelsTable,
    }
}
</script>
