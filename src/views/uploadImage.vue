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
    import type { ITemplate, IFile } from '@/models';
    import { ref } from 'vue';

    const ddAreaStyleDefault: string = 'bg-inherit'
    const selectedImages = ref<[IFile] | null>(null);
    const imageInput = ref<HTMLInputElement | null>(null);
    const isDragging = ref(false);
    const ddAreaStyle = ref(ddAreaStyleDefault);

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
            console.log('uploaded');
        }else {
            console.log('not uploaded');
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
    
    function AddImagesToSelecedImages(images: FileList | null){
        if(!images || images.length === 0) return;
        for(let i=0; i<images.length; i++){
            if(images[i].type.split('/')[0] != 'image') continue;
            if(!selectedImages.value){
                selectedImages.value = [{name: images[i].name, url:URL.createObjectURL(images[i])}];
            } else if(!selectedImages.value?.some((e: IFile) => e.name === images[i].name)){
                selectedImages.value?.push({name: images[i].name, url:URL.createObjectURL(images[i])});
            }
        }
        console.log(selectedImages.value);
    }
</script>

<template>
    <div class="mt-[-50px]">
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