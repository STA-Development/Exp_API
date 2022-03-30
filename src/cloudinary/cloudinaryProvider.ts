import {ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider: { provide: string; useFactory: () => ConfigOptions } = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            cloud_name: process.env.CLOUDINARY_cloud_nam,
            api_key: process.env.CLOUDINARY_api_key,
            api_secret: process.env.CLOUDINARY_api_secret,
        });
    },
};
