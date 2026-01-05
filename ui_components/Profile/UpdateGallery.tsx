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
  const { attributes, listeners, setNodeRef, isDragging, isOver, transition } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        touchAction: "pan-y"
      }}
      className={`
        relative w-full overflow-hidden cursor-move
        ${isMain ? "aspect-[4/3] md:aspect-square rounded-3xl" : "aspect-square rounded-2xl"}
        ${isDragging ? "opacity-30" : "opacity-100"}
        ${isOver && !isDragging ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
    >
      {isOver && !isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-400 rounded-inherit" />
      )}

      <Image
        src={image.url}
        alt="Gallery"
        fill
        className="object-cover pointer-events-none"
      />

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <img src={images.gallery.src} className="w-9 h-9" alt="gallery" />
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    haptic();
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
  };

  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1);
  const activeImage = galleryImages.find((i) => i.id === activeId);
  const isMainActive = activeId === mainImage.id;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{
        droppable: { strategy: MeasuringStrategy.WhileDragging }
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="md:bg-white md:shadow-md md:px-20 md:py-16 md:rounded-[40px]">
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

      {/* ✅ MOBILE-SAFE DRAG PREVIEW */}
      <DragOverlay adjustScale={false} dropAnimation={null}>
        {activeImage && (
          <div
            style={{ pointerEvents: "none" }}
            className={`relative overflow-hidden shadow-xl ${
              isMainActive
                ? "w-[92vw] aspect-[4/3] rounded-3xl"
                : "w-[45vw] aspect-square rounded-2xl"
            }`}
          >
            <Image
              src={activeImage.url}
              alt="Dragging"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 right-4">
              <img src={images.gallery.src} className="w-9 h-9" alt="gallery" />
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default UpdateGallery;
