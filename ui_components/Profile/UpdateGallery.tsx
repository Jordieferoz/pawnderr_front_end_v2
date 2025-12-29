"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
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
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

interface GalleryImage {
  id: string;
  url: string;
}

interface SortableImageProps {
  image: GalleryImage;
  isMain?: boolean;
}

const SortableImage: FC<SortableImageProps> = ({ image, isMain = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: image.id,
    transition: null
  });

  if (isMain) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`relative w-full aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden cursor-move ${
          isDragging ? "opacity-30" : "opacity-100"
        }`}
      >
        <Image
          src={image.url}
          alt="Main pet photo"
          fill
          className="object-cover pointer-events-none"
        />

        <div
          className={`absolute bottom-4 right-4 ${isDragging ? "opacity-0" : "opacity-100"}`}
        >
          <img
            src={images.gallery?.src}
            alt="Reorder"
            className="w-9 h-9 pointer-events-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`relative w-full aspect-square rounded-2xl overflow-hidden cursor-move ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      <Image
        src={image.url}
        alt="Gallery photo"
        fill
        className="object-cover rounded-2xl pointer-events-none"
      />
      <div
        className={`absolute bottom-4 right-4 ${isDragging ? "opacity-0" : "opacity-100"}`}
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
  const dispatch = useDispatch();
  const [galleryImages, setGalleryImages] =
    useState<GalleryImage[]>(dummyImages);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGalleryImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleSave = () => {};

  const mainImage = galleryImages[0];
  const thumbnailImages = galleryImages.slice(1);
  const activeImage = galleryImages.find((img) => img.id === activeId);
  const isMainActive = activeImage?.id === mainImage.id;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
        <div className="space-y-6">
          {/* Mobile: Stacked layout */}
          <div className="md:hidden space-y-6">
            <SortableContext
              items={galleryImages.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <SortableImage image={mainImage} isMain />

              <div className="grid grid-cols-2 gap-4">
                {thumbnailImages.map((image) => (
                  <SortableImage key={image.id} image={image} />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Desktop: Two column layout */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <SortableContext
              items={galleryImages.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div>
                <SortableImage image={mainImage} isMain />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {thumbnailImages.map((image) => (
                  <SortableImage key={image.id} image={image} />
                ))}
              </div>
            </SortableContext>
          </div>

          <div className="pt-6">
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeImage ? (
          <div
            className={`relative ${
              isMainActive
                ? "w-[350px] aspect-[4/3] md:aspect-square"
                : "w-[200px] aspect-square"
            } rounded-3xl overflow-hidden shadow-2xl rotate-6 scale-105`}
          >
            <Image
              src={activeImage.url}
              alt="Dragging"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 right-4">
              <img
                src={images.gallery?.src}
                alt="Reorder"
                className="w-9 h-9"
              />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default UpdateGallery;
