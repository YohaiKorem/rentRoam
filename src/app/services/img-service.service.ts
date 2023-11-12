import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class imgService {
  private cld = new Cloudinary({
    cloud: { cloudName: environment.cloudinaryCloudName },
  });
  constructor() {}
  uploadImageToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadPreset = environment.cloudinaryUploadPreset; // Replace with your preset

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      fetch(
        `https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject('Failed to get secure URL');
          }
        })
        .catch((error) => {
          reject('Error uploading to Cloudinary: ' + error);
        });
    });
  }
}
