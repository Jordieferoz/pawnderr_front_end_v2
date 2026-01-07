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
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable(
    { id: image.id }
  );

  const style = {
    touchAction: "none" as const
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative w-full overflow-hidden cursor-move transition-all duration-200
        ${isMain ? "aspect-[4/3] md:aspect-square rounded-3xl" : "aspect-square rounded-2xl"}
        ${isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"}
        ${isOver && !isDragging ? "ring-4 ring-blue-500 ring-offset-4 scale-105" : ""}
      `}
    >
      {isOver && !isDragging && (
        <div className="absolute inset-0 bg-blue-50/50 border-4 border-dashed border-blue-500 rounded-inherit z-10" />
      )}

      <Image
        src={image.url}
        alt="Gallery"
        fill
        className="object-cover pointer-events-none"
        draggable={false}
      />

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <img
          src={images.gallery.src}
          className="w-9 h-9"
          alt="gallery"
          draggable={false}
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
  const [galleryImages, setGalleryImages] = useState(dummyImages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    haptic();
  };

  const handleDragOver = ({ over }: any) => {
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setGalleryImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      haptic(15);
    }
    setActiveId(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1);
  const activeImage = galleryImages.find((i) => i.id === activeId);
  const isMainActive = activeId === mainImage.id;

  // Check if hovering over a thumbnail position
  const isOverThumbnail = overId
    ? thumbnails.some((img) => img.id === overId)
    : false;
  // Check if hovering over the main image position
  const isOverMain = overId === mainImage.id;

  return (
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
      <div className="md:bg-white md:shadow-md md:p-8 md:rounded-[40px]">
        <SortableContext
          items={galleryImages.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="md:hidden space-y-6">
            <SortableImage image={mainImage} isMain />
            <div className="grid grid-cols-2 gap-4">
              {thumbnails.map((img) => (
                <SortableImage key={img.id} image={img} />
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <SortableImage image={mainImage} isMain />
            <div className="grid grid-cols-2 gap-4">
              {thumbnails.map((img) => (
                <SortableImage key={img.id} image={img} />
              ))}
            </div>
          </div>
        </SortableContext>

        <div className="pt-6">
          <Button className="w-full">Save</Button>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeImage && (
          <div
            className={`relative overflow-hidden shadow-2xl cursor-grabbing transition-all duration-300 ease-out ${
              isMainActive && isOverThumbnail
                ? "w-[140px] aspect-square rounded-2xl scale-90"
                : isMainActive
                  ? "w-[280px] aspect-[4/3] md:w-[320px] md:aspect-square rounded-3xl"
                  : !isMainActive && isOverMain
                    ? "w-[280px] aspect-[4/3] md:w-[320px] md:aspect-square rounded-3xl scale-105"
                    : !isMainActive && isOverThumbnail
                      ? "w-[140px] aspect-square rounded-2xl scale-90"
                      : "w-[140px] aspect-square rounded-2xl"
            }`}
          >
            <Image
              src={activeImage.url}
              alt="Dragging"
              fill
              className="object-cover"
              draggable={false}
            />
            <div className="absolute bottom-4 right-4">
              <img
                src={images.gallery.src}
                className="w-9 h-9"
                alt="gallery"
                draggable={false}
              />
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default UpdateGallery;
