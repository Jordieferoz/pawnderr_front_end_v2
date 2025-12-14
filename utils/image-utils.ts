// utils/image-utils.ts

/**
 * Convert File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert base64 string to File object
 */
export const base64ToFile = (
  base64: string,
  filename: string = "image.jpg",
): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * Convert multiple Files to base64 strings
 */
export const filesToBase64 = async (
  files: (File | string)[],
): Promise<string[]> => {
  const promises = files.map(async (file) => {
    if (typeof file === "string") {
      return file; // Already base64 or URL
    }
    return fileToBase64(file);
  });

  return Promise.all(promises);
};

/**
 * Convert multiple base64 strings to File objects
 */
export const base64ToFiles = (base64Strings: string[]): File[] => {
  return base64Strings
    .map((base64, index) => {
      // Skip if already a URL (not base64)
      if (base64.startsWith("http://") || base64.startsWith("https://")) {
        // You might want to handle URLs differently
        return null as any; // or handle URLs appropriately
      }
      return base64ToFile(base64, `image-${index}.jpg`);
    })
    .filter(Boolean);
};

/**
 * Check if string is base64 encoded
 */
export const isBase64 = (str: string): boolean => {
  return str.startsWith("data:image/");
};

/**
 * Get file size from base64 string (in bytes)
 */
export const getBase64Size = (base64: string): number => {
  const stringLength = base64.length - "data:image/png;base64,".length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  return sizeInBytes;
};

/**
 * Compress image before converting to base64 (optional - for large images)
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
