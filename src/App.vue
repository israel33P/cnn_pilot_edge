<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';

  import { PayloadHelper } from './helpers/PayloadHelper';
  import TemplateHelper from './helpers/TemplateHelper';
  import tempList from './helpers/TemplateList';
  import type { ITemplate, ITemplateGroup } from './models';
  import Router from './router/Router.vue';

  interface ComponentMap { [key: string]: any; }

  const queryParams = new URLSearchParams(window.location.search);
  const router = useRouter();
  const route = ref(queryParams.get('template')?.toLowerCase());
  const templateGroups = ref<ITemplateGroup[]>([]);
  const loadedComponents = ref<ComponentMap>({});

  const handlerUrlChange = (to: any) => {
    route.value = to.query.route?.toLowerCase();
  };

  watch(router.currentRoute, handlerUrlChange);

  function getFileName(assetPath: string): string {
    const parts = assetPath.split('/');
    const fileNameWithExtension = parts[parts.length -1];
    return fileNameWithExtension.replace('.vue', '').toLowerCase();
  }

  function handleMetadata(name: string, metadata: any, component: any) {
    const route = getFileName(name);
    const concept = metadata.concept ?? 'Empty';
    const templates = TemplateHelper.templateGroups.filter((group) => group.name == concept);
    const tmpsExists = templates.length > 0;
    const tmpGroup = tmpsExists ? templates[0] : { name: concept, templates: [] as ITemplate[] };
    
    if (!tmpsExists) TemplateHelper.templateGroups.push(tmpGroup);

    const tmpExists = tmpGroup.templates.filter((tmp) => tmp.route == route).length > 0;
    if (!tmpExists) {
      tmpGroup.templates.push({
        component: component,
        name: metadata.name,
        route: getFileName(name),
        description: metadata.description,
        author: metadata.author,
        updated: metadata.updated,
        concept: concept,
      });
      templateGroups.value = TemplateHelper.templateGroups;
    }
  }

  onMounted(async () => {
    const loaded: ComponentMap = {};
    const componentLoader = [];

    for (const name in tempList) {
      if (tempList.hasOwnProperty(name)) {
        componentLoader.push(
          tempList[name]().then((module: any) => {
            loaded[name] = { component: module.default, metadata: module.metadata };
          })
        );
      }
    }
    await Promise.all(componentLoader);
    loadedComponents.value = loaded;

    for (const loadedTmp in loaded) {
      handleMetadata(loadedTmp, loaded[loadedTmp].metadata, loaded[loadedTmp].component);
    }
  });
</script>

<template>
  <div v-if="templateGroups.length > 0">
    <Router />
  </div>
</template>

