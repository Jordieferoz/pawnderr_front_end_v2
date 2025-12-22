// utils/api.ts

// Update the interface to match the actual nested API response
export interface PhotoUploadData {
  temporary_id: string;
  image_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface PhotoUploadResponse {
  status: string;
  data: PhotoUploadData;
  message: string;
}
