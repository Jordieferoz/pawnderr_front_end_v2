"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import Image from "next/image";
import { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

interface GalleryImage {
  id: string;
  url: string;
}

const haptic = (ms = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(ms);
  }
};

interface SortableImageProps {
  image: GalleryImage;
  isMain?: boolean;
}

const SortableImage: FC<SortableImageProps> = ({ image, isMain = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    isOver,
    transform,
    transition
  } = useSortable({
    id: image.id
  });

  const style = {
    // Remove transform - keep items in place
    transition: transition ?? "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    touchAction: "pan-y"
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`
        relative w-full overflow-hidden cursor-move
        ${isMain ? "aspect-[4/3] md:aspect-square rounded-3xl" : "aspect-square rounded-2xl"}
        ${isDragging ? "opacity-30" : "opacity-100"}
        ${isOver && !isDragging ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
    >
      {/* Placeholder when dragging over */}
      {isOver && !isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-400 rounded-inherit" />
      )}

      <Image
        src={image.url}
        alt="Gallery photo"
        fill
        className="object-cover pointer-events-none"
      />

      <div
        className={`absolute bottom-4 right-4 transition-opacity ${
          isDragging ? "opacity-30" : "opacity-100"
        }`}
      >
        <img
          src={images.gallery?.src}
          alt="Reorder"
          className="w-9 h-9 pointer-events-none"
        />
      </div>
    </div>
  );
};

const dummyImages: GalleryImage[] = [
  { id: "1", url: images.doggo1.src },
  { id: "2", url: images.doggo2.src },
  { id: "3", url: images.doggo3.src },
  { id: "4", url: images.doggo4.src },
  { id: "5", url: images.doggo5.src }
];

const UpdateGallery: FC = () => {
  const [galleryImages, setGalleryImages] =
    useState<GalleryImage[]>(dummyImages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 350,
        tolerance: 12
      }
    }),
    isMobile
      ? undefined
      : useSensor(PointerSensor, {
          activationConstraint: { distance: 8 }
        }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    haptic(10);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGalleryImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      haptic(15);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const mainImage = galleryImages[0];
  const thumbnailImages = galleryImages.slice(1);
  const activeImage = galleryImages.find((img) => img.id === activeId);
  const isMainImageActive = activeId === mainImage.id;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.WhileDragging
        }
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
        <SortableContext
          items={galleryImages.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="md:hidden space-y-6">
            <SortableImage image={mainImage} isMain />
            <div className="grid grid-cols-2 gap-4">
              {thumbnailImages.map((image) => (
                <SortableImage key={image.id} image={image} />
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <SortableImage image={mainImage} isMain />
            <div className="grid grid-cols-2 gap-4">
              {thumbnailImages.map((image) => (
                <SortableImage key={image.id} image={image} />
              ))}
            </div>
          </div>
        </SortableContext>

        <div className="pt-6">
          <Button className="w-full">Save</Button>
        </div>
      </div>

      {/* Simplified Drag Overlay */}
      <DragOverlay>
        {activeImage && (
          <div
            className={`relative w-full overflow-hidden shadow-xl ${
              isMainImageActive
                ? "aspect-[4/3] md:aspect-square rounded-3xl"
                : "aspect-square rounded-2xl"
            }`}
          >
            <Image
              src={activeImage.url}
              alt="Dragging"
              fill
              className="object-cover pointer-events-none"
            />
            <div className="absolute bottom-4 right-4">
              <img
                src={images.gallery?.src}
                alt="Reorder"
                className="w-9 h-9"
              />
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default UpdateGallery;
