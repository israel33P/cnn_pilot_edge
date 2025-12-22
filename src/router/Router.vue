<script setup lang="ts">
    import NavBar from '@/components/NavBar.vue'
    import { useRouter } from 'vue-router';
    import { onMounted, computed, watch, ref } from 'vue';
    import TemplateHelper from '@/helpers/TemplateHelper';

    const router = useRouter();
    const queryParams = new URLSearchParams(window.location.search);
    const route = ref(queryParams.get('template')?.toLowerCase());
    const dev = ref(queryParams.get('dev')?.toLowerCase());
    const concept = ref('');
    const author = ref('');
    const name = ref('');
    const description = ref('');
    const updated = ref('');
    //const navLinks = ref([] as string[]);

    const handleUrlChange = (to: any) => {
        route.value = to.query.route?.toLowerCase();
        dev.value = to.query.dev?.toLowerCase();
    };

    const dynamicComponent = computed(() => {
        const temp = TemplateHelper.getTemplateFromRoute();

        concept.value = temp?.concept ?? '';
        author.value = temp?.author ?? '';
        name.value = temp?.name.toUpperCase() ?? '';
        description.value = temp?.description ?? '';
        updated.value = temp?.updated ?? '';

        if (temp) {
            return temp.component;
        }
    });
    const mainWindowPosition = computed(() => {
        return dev.value == 'true' ? 'mt-[55px] pt-3 mx-5' : 'm-1 p-0 relative';
    });
    const isDev = computed(() => {
        return dev.value == 'true';
    });

    onMounted(() => {
        watch(router.currentRoute, handleUrlChange);
    });
</script>

<template>
    <NavBar v-if="isDev" title="Pilot Edge Components" :concept="concept"></NavBar>
    <div class="flex" :class="mainWindowPosition">
        <div class="w-full">
            <div v-if="name !='' && isDev" class="grid grid-cols-1 place-items-center mb-6 pt-3">
                <p class="text-4xl font-thin lg:text-6xl">{{ name }}</p>
                <p v-if="description !=''" class="text-sm mt-1 font-thin lg:text-lg">{{ description }}</p>
            </div>
            <component :is="dynamicComponent" />
        </div>
    </div>
    <footer v-if="isDev" class="w-full bottom-0">
        <div class="mx-3">
            <hr class="mt-5 border-is-light/40">
            <div class="my-3 mx-2 grid grid-cols-1 lg:grid-cols-2 place-content-around">
                <p class="text-is-light/40">@CNN-Design Vizrt team</p>
                <div class="lg:place-self-end lg:flex gap-3">
                    <p class="text-is-light/40">author: {{ author }}</p>
                    <p class="text-is-light/40">last updated: {{  updated }}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

