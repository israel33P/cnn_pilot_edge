<script lang="ts">
    export const metadata: ITemplate ={
        name: 'upload image',
        description: 'This page is used to upload images',
        concept: '',
        author: 'Israel Sanchez',
        updated: '07/15/2025'
    };
</script>
<script setup lang="ts">
    import type { ITemplate, IImageFile } from '@/models';
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router'
    import axios from 'axios';

    const ddAreaStyleDefault: string = 'bg-inherit'
    const selectedImages = ref<[IImageFile] | null>(null);
    const imageInput = ref<HTMLInputElement | null>(null);
    const isDragging = ref(false);
    const ddAreaStyle = ref(ddAreaStyleDefault);
    const route = useRoute()

    const onImageSelected = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const images = target.files;
        AddImagesToSelecedImages(images);
    }
    const triggerImageUpload = () => {
        imageInput.value?.click();
    }
    const ingestImage = () => {
        if(selectedImages.value){
            postImagesToGH();
        }else {
            console.log('No Images to upload');
        }
    }
    const deleteImage = (index: number) => {
        const tempImg = selectedImages.value?.splice(index, 1);
        if(tempImg) URL.revokeObjectURL(tempImg![0].url);
    }
    const onDragOver = (event: DragEvent) => {
        if(!event.dataTransfer) return;
        event.preventDefault();
        isDragging.value = true;
        ddAreaStyle.value = 'bg-white/45';
        event.dataTransfer!.dropEffect = 'copy';
    }
    const onDragLeave = (event: DragEvent) => {
        event.preventDefault();
        isDragging.value = false;
        ddAreaStyle.value = ddAreaStyleDefault;
    }
    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragging.value = false;
        ddAreaStyle.value = ddAreaStyleDefault;
        if(!event.dataTransfer) return;
        const images = event.dataTransfer!.files;
        AddImagesToSelecedImages(images);
    }
    
    async function AddImagesToSelecedImages(images: FileList | null){
        if(!images || images.length === 0) return;
        for(let i=0; i<images.length; i++){
            if(images[i].type.split('/')[0] != 'image') continue;
            if(!selectedImages.value){
                selectedImages.value = [{
                    name: images[i].name.split('.')[0],
                    type: images[i].type,
                    url:URL.createObjectURL(images[i]),
                    ab: await images[i].arrayBuffer(),
                }];
            } else if(!selectedImages.value?.some((e: IImageFile) => e.name === images[i].name)){
                selectedImages.value?.push({
                    name: images[i].name.split('.')[0],
                    type: images[i].type,
                    url:URL.createObjectURL(images[i]),
                    ab: await images[i].arrayBuffer(),
                });
            }
        }
    }

    async function postImagesToGH() {
        try {
            if(!selectedImages.value) return 
            for(let i = selectedImages.value.length -1; i >= 0; i--) {
                const temp_image = selectedImages.value[i];
                if (temp_image.ab){
                    const byteArray : Uint8Array = new Uint8Array(temp_image.ab)
                    await axios.post('http://viz-util3-mse.tbsbest.com:19398/folder/8C2A5AD2-878E-0546-8CE2B27D3E31835A/',
                        byteArray,
                        {
                            headers: {
                                'Authorization': import.meta.env.VITE_VIZ_AUTH,
                                'Content-Type': temp_image.type,
                                'Slug': temp_image.name,
                            },
                            auth : {
                                username: import.meta.env.VITE_VIZ_USER,
                                password: import.meta.env.VITE_VIZ_PASSWORD,
                            },
                        },
                    ).then((res)=> {
                        deleteImage(i);
                        console.log('Uploaded:', res);
                    });
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function ghImageFolderUrl(): string {
        let folder: string | undefined = route.query.folder?.toString();
        if (folder?.startsWith('<')) folder = folder.slice(1,-1);
        if (folder?.endsWith('>')) folder = folder.slice(0,-1);
        return `${ghUrl()}/folder/${folder}`;
    }
    function ghUrl() {
        let hostName: string = "http://viz-util1-mse.com";
        let port: string = "19398";
        let input: string | undefined = route.query.gh?.toString();
        if (input){
            if (input.endsWith('/')) input = input.slice(0,-1);
            if (input.endsWith(':')) input = input.slice(0,-1);
            if (!input.startsWith('http://') && !input.startsWith('https://')){
                input = `http://${input}`;
                hostName = input;
            }
            if (!input.includes(':')){
                hostName = input.split(':')[0];
                port = input.split(':')[1];
            }
        }
        return `${hostName}:${port}/`;
    };
    const test = computed(() => ghImageFolderUrl());
</script>

<template>
    <div class="mt-[-50px]">
        <p>{{ test }}</p>
        <input
        class="hidden"
        type="file" 
        multiple
        accept="image/*"
        @change="onImageSelected"
        ref="imageInput">
        <div class="w-full">
            <div class="grid place-items-center">
                <div class="shadow-xl p-4">
                    <div class="drag-area rounded-xl p-4 border-2 border-dotted grid place-items-center min-w-[350px]"
                    :class="ddAreaStyle"
                    @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
                        <span v-if="!isDragging">
                            Drag & drop image here or
                            <span class="text-secondary hover:cursor-pointer" role="button" @click="triggerImageUpload">
                                Choose
                            </span>
                        </span>
                        <div class="text-black/70 font-bold" v-else>Drop images here</div>
                    </div>
                    <div class="mt-1 flex gap-2">
                        <div class="w-7 h-7 relative mb-1" v-for="(image, idx) in selectedImages" :key="idx">
                            <span @click="deleteImage(idx)" class="absolute top-0 right-0 text-cnn bg-white rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
                                </svg>
                            </span>
                            <img class="w-full h-full border-5 rounded-lg" :src="image.url"/>
                        </div>
                    </div>
                    <button class="w-full mt-1" @click="ingestImage">Upload Image</button>
                </div>
            </div>
        </div>
    </div>
</template>