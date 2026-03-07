"use client";

import { X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { addPetPhoto, deletePetPhoto, reorderPetPhotos } from "@/utils/api";

import ImageCropper from "../Shared/ImageCropper";
import Loader from "../Shared/Loader";
import Modal from "../Shared/Modal";
import { showToast } from "../Shared/ToastMessage";
import { IPetData } from "./types";

interface GalleryImage {
  id: number;
  url: string;
  display_order: number;
}

const haptic = (ms = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(ms);
  }
};

interface GalleryImageItemProps {
  image: GalleryImage;
  isMain?: boolean;
  onDelete: (id: number) => void;
  onSetPrimary: (id: number) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
}

const GalleryImageItem: FC<GalleryImageItemProps> = ({
  image,
  isMain = false,
  onDelete,
  onSetPrimary,
  isDeleting = false,
  isReordering = false
}) => {
  return (
    <div className="relative group">
      {/* Delete Button - Outside the image container */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image.id);
        }}
        disabled={isDeleting || isReordering}
        className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        onClick={() => !isMain && !isReordering && onSetPrimary(image.id)}
        className={`
          relative w-full overflow-hidden transition-all duration-200
          ${isMain ? "aspect-[4/3] md:aspect-square rounded-3xl cursor-default" : "aspect-square rounded-2xl cursor-pointer hover:opacity-90 active:scale-95"}
          ${isDeleting || isReordering ? "pointer-events-none opacity-50" : ""}
          ${!isMain && !isReordering ? "hover:ring-4 hover:ring-blue-200" : ""}
        `}
      >
        <img
          src={image.url}
          alt="Gallery"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {isMain && (
          <div className="absolute bottom-3 left-3 bg-blue text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
            Primary
          </div>
        )}
      </div>
    </div>
  );
};

interface UpdateGalleryProps {
  petData?: IPetData | null;
  loading?: boolean;
}

const UpdateGallery: FC<UpdateGalleryProps> = ({
  petData,
  loading = false
}) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  // Load images from petData
  useEffect(() => {
    if (petData?.images && petData.images.length > 0) {
      const sortedImages = [...petData.images]
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => ({
          id: img.id,
          url: img.image_url,
          display_order: img.display_order
        }));
      setGalleryImages(sortedImages);
    }
  }, [petData]);

  const handleSetPrimary = async (imageId: number) => {
    if (isReordering) return;

    const index = galleryImages.findIndex((img) => img.id === imageId);
    if (index <= 0) return; // Already primary or not found

    const newImages = [...galleryImages];
    // Swap the clicked image with the first image (primary)
    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];

    // Update local state
    setGalleryImages(newImages);
    haptic(15);

    // Call API
    await handleReorder(newImages);
  };

  const handleReorder = async (reorderedImages: GalleryImage[]) => {
    if (!petData?.id) return;

    setIsReordering(true);

    try {
      // Prepare payload with updated display orders
      const imageOrders = reorderedImages.map((img, index) => ({
        image_id: img.id,
        display_order: index
      }));

      const payload = {
        image_orders: imageOrders
      };

      const response = await reorderPetPhotos(petData.id, payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showToast({
          type: "success",
          message: "Primary photo updated"
        });

        // Update display_order in local state
        setGalleryImages((prev) =>
          prev.map((img, index) => ({
            ...img,
            display_order: index
          }))
        );
      }
    } catch (error: any) {
      console.error("❌ Failed to update photos:", error);

      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to update photos. Please try again."
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!petData?.id) return;

    // Prevent deleting if only one image left
    if (galleryImages.length <= 1) {
      showToast({
        type: "error",
        message: "You must have at least one photo"
      });
      return;
    }

    setDeletingImageId(imageId);

    try {
      const response = await deletePetPhoto(petData.id, imageId);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Remove from local state
        setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));

        showToast({
          type: "success",
          message: "Photo deleted successfully"
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to delete photo:", error);

      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to delete photo. Please try again."
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !petData?.id) return;

    // Check if adding would exceed MAX_IMAGES
    if (galleryImages.length >= MAX_IMAGES) {
      showToast({
        type: "error",
        message: `You can only have up to ${MAX_IMAGES} photos.`
      });
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setSelectedImageSrc(reader.result?.toString() || null);
      setIsCropperOpen(true);
    });
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async (croppedBlob: Blob) => {
    if (!petData?.id) return;

    setIsCropperOpen(false);
    setIsUploading(true);

    try {
      // Convert blob to file
      const file = new File([croppedBlob], "image.jpg", { type: "image/jpeg" });

      const response = await addPetPhoto(petData.id, file);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Add new image to local state
        const newImage: GalleryImage = {
          id: response.data.data.id,
          url: response.data.data.image_url,
          display_order: response.data.data.display_order
        };

        setGalleryImages((prev) =>
          [...prev, newImage].sort((a, b) => a.display_order - b.display_order)
        );

        showToast({
          type: "success",
          message: "Photo uploaded successfully"
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to upload photo:", error);
      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to upload photo. Please try again."
      });
    } finally {
      setIsUploading(false);
      setSelectedImageSrc(null);
    }
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedImageSrc(null);
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader size={40} text="Loading photos..." />
        </div>
      </div>
    );
  }

  if (!petData || galleryImages.length === 0) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-gray-600 mb-4">No photos yet</p>
          <Button onClick={handleAddPhotos} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Photos"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1);
  const canAddMore = galleryImages.length < MAX_IMAGES;

  return (
    <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        <GalleryImageItem
          image={mainImage}
          isMain
          onDelete={handleDelete}
          onSetPrimary={handleSetPrimary}
          isDeleting={deletingImageId === mainImage.id}
          isReordering={isReordering}
        />
        <div className="grid grid-cols-2 gap-4">
          {thumbnails.map((img) => (
            <GalleryImageItem
              key={img.id}
              image={img}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
              isDeleting={deletingImageId === img.id}
              isReordering={isReordering}
            />
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6">
        <GalleryImageItem
          image={mainImage}
          isMain
          onDelete={handleDelete}
          onSetPrimary={handleSetPrimary}
          isDeleting={deletingImageId === mainImage.id}
          isReordering={isReordering}
        />
        <div className="grid grid-cols-2 gap-4">
          {thumbnails.map((img) => (
            <GalleryImageItem
              key={img.id}
              image={img}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
              isDeleting={deletingImageId === img.id}
              isReordering={isReordering}
            />
          ))}
        </div>
      </div>

      {/* Add Photos Button */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <Button
          onClick={handleAddPhotos}
          disabled={isUploading || isReordering || !canAddMore}
          className="w-full md:w-auto"
        >
          {isUploading
            ? "Uploading..."
            : `Add Photos (${galleryImages.length}/${MAX_IMAGES})`}
        </Button>
        {!canAddMore && (
          <p className="text-sm text-gray-500">
            Maximum {MAX_IMAGES} photos allowed. Delete some to add more.
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isReordering && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
          <Loader size={40} text="Saving new order..." />
        </div>
      )}

      {/* Cropper Modal */}
      <Modal
        open={isCropperOpen}
        setOpen={setIsCropperOpen}
        content={
          selectedImageSrc && (
            <ImageCropper
              imageSrc={selectedImageSrc}
              onCropComplete={handleCropConfirm}
              onCancel={handleCropCancel}
            />
          )
        }
        className="max-w-xl w-full p-0 overflow-hidden bg-black md:bg-white"
      />
    </div>
  );
};

export default UpdateGallery;
