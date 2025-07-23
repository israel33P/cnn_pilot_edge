export interface IImageFile {
    name: string,
    type: string,
    url: string,
    ab?: ArrayBuffer | null
    form?: FormData
};