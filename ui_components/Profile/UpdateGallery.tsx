"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from "@dnd-kit/sortable";
import { X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { addPetPhoto, deletePetPhoto, reorderPetPhotos } from "@/utils/api";

import Loader from "../Shared/Loader";
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

interface SortableImageProps {
  image: GalleryImage;
  isMain?: boolean;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  isOver?: boolean;
  isDragging?: boolean;
}

const SortableImage: FC<SortableImageProps> = ({
  image,
  isMain = false,
  onDelete,
  isDeleting = false,
  isOver = false,
  isDragging = false
}) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: image.id
  });

  return (
    <div className="relative">
      {/* Delete Button - Outside the image container */}
      {!isDragging && (
        <button
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`
          relative w-full overflow-hidden cursor-grab active:cursor-grabbing
          ${isMain ? "aspect-[4/3] md:aspect-square rounded-3xl" : "aspect-square rounded-2xl"}
          ${isDragging ? "opacity-30" : "opacity-100"}
          ${isDeleting ? "pointer-events-none opacity-50" : ""}
          ${isOver && !isDragging ? "ring-4 ring-blue-500" : ""}
        `}
      >
        <img
          src={image.url}
          alt="Gallery"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {isMain && !isDragging && (
          <div className="absolute top-3 left-3 bg-blue text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
            Primary
          </div>
        )}
      </div>
    </div>
  );
};

interface DragOverlayImageProps {
  image: GalleryImage;
  isOverMain: boolean;
  isMain: boolean;
}

const DragOverlayImage: FC<DragOverlayImageProps> = ({
  image,
  isOverMain,
  isMain
}) => {
  const shouldShowAsMain = isOverMain;
  const isDraggingMain = isMain;

  return (
    <div
      className={`
        relative overflow-hidden shadow-2xl cursor-grabbing
        ${shouldShowAsMain ? "aspect-[4/3] md:aspect-square rounded-3xl w-[280px] md:w-[180px]" : "aspect-square rounded-2xl w-[140px] md:w-[120px]"}
      `}
    >
      <img
        src={image.url}
        alt="Dragging"
        className="w-full h-full object-cover"
        draggable={false}
      />
      {isDraggingMain && shouldShowAsMain && (
        <div className="absolute top-3 left-3 bg-blue text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
          Primary
        </div>
      )}
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
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8
      }
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as number);
    haptic();
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id as number | null);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = galleryImages.findIndex((i) => i.id === active.id);
      const newIndex = galleryImages.findIndex((i) => i.id === over.id);
      const reorderedImages = arrayMove(galleryImages, oldIndex, newIndex);

      // Update local state immediately for smooth UX
      setGalleryImages(reorderedImages);
      haptic(15);

      // Call reorder API
      await handleReorder(reorderedImages);
    }
    setActiveId(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
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
          message: "Photos reordered successfully"
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
      console.error("❌ Failed to reorder photos:", error);

      // Revert to original order on error
      if (petData?.images) {
        const originalImages = [...petData.images]
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            display_order: img.display_order
          }));
        setGalleryImages(originalImages);
      }

      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to reorder photos. Please try again."
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
    if (galleryImages.length + files.length > MAX_IMAGES) {
      showToast({
        type: "error",
        message: `You can only have up to ${MAX_IMAGES} photos. You can add ${MAX_IMAGES - galleryImages.length} more.`
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload files one by one
      for (const file of Array.from(files)) {
        const response = await addPetPhoto(petData.id, file);

        if (response.statusCode === 200 || response.statusCode === 201) {
          // Add new image to local state
          const newImage: GalleryImage = {
            id: response.data.data.id,
            url: response.data.data.image_url,
            display_order: response.data.data.display_order
          };

          setGalleryImages((prev) =>
            [...prev, newImage].sort(
              (a, b) => a.display_order - b.display_order
            )
          );
        }
      }

      showToast({
        type: "success",
        message: "Photos uploaded successfully"
      });
    } catch (error: any) {
      console.error("❌ Failed to upload photos:", error);

      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to upload photos. Please try again."
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader size="lg" text="Loading photos..." />
        </div>
      </div>
    );
  }

  if (!petData || galleryImages.length === 0) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-gray-600 mb-4">No photos yet</p>
          <Button onClick={handleAddPhotos} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Photos"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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
  const activeImage = galleryImages.find((i) => i.id === activeId);
  const isOverMain = overId === mainImage.id;
  const isDraggingMain = activeId === mainImage.id;

  return (
    <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{
          droppable: { strategy: MeasuringStrategy.WhileDragging }
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={galleryImages.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            <SortableImage
              image={mainImage}
              isMain
              onDelete={handleDelete}
              isDeleting={deletingImageId === mainImage.id}
              isOver={overId === mainImage.id}
              isDragging={activeId === mainImage.id}
            />
            <div className="grid grid-cols-2 gap-4">
              {thumbnails.map((img) => (
                <SortableImage
                  key={img.id}
                  image={img}
                  onDelete={handleDelete}
                  isDeleting={deletingImageId === img.id}
                  isOver={overId === img.id}
                  isDragging={activeId === img.id}
                />
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <SortableImage
              image={mainImage}
              isMain
              onDelete={handleDelete}
              isDeleting={deletingImageId === mainImage.id}
              isOver={overId === mainImage.id}
              isDragging={activeId === mainImage.id}
            />
            <div className="grid grid-cols-2 gap-4">
              {thumbnails.map((img) => (
                <SortableImage
                  key={img.id}
                  image={img}
                  onDelete={handleDelete}
                  isDeleting={deletingImageId === img.id}
                  isOver={overId === img.id}
                  isDragging={activeId === img.id}
                />
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeImage && (
            <DragOverlayImage
              image={activeImage}
              isOverMain={isOverMain}
              isMain={isDraggingMain}
            />
          )}
        </DragOverlay>
      </DndContext>

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
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isReordering && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
          <Loader size="sm" text="Saving new order..." />
        </div>
      )}
    </div>
  );
};

export default UpdateGallery;
