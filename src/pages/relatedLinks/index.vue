<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <related-links-table />
            </div>
        </div>

    </div>
</template>

<script>
import RelatedLinksTable from './RelatedLinksTable.vue';

export default {
    components: {
        RelatedLinksTable,
    }
}
</script>
