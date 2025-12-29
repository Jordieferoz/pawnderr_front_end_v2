"use client";

import Image from "next/image";
import { FC, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

interface GalleryImage {
  id: string;
  url: string;
}

interface DraggableImageProps {
  image: GalleryImage;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  isMain?: boolean;
}

const ItemType = "IMAGE";

const DraggableImage: FC<DraggableImageProps> = ({
  image,
  index,
  moveImage,
  isMain = false
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  drag(drop(ref));

  if (isMain) {
    return (
      <div
        ref={ref}
        className={`relative w-full aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden cursor-move transition-all duration-300 ease-in-out ${
          isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
        } ${isOver ? "ring-4 ring-blue-400 ring-opacity-50" : ""}`}
      >
        <Image
          src={image.url}
          alt="Main pet photo"
          fill
          className="object-cover transition-transform duration-300"
        />

        <div
          className={`absolute bottom-4 right-4 transition-all duration-300 ${
            isDragging ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src={images.gallery?.src} alt="Reorder" className="w-9 h-9" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative w-full aspect-square rounded-2xl overflow-hidden cursor-move transition-all duration-300 ease-in-out ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
      } ${isOver ? "ring-4 ring-blue-400 ring-opacity-50" : ""}`}
    >
      <Image
        src={image.url}
        alt={`Gallery photo ${index}`}
        fill
        className="object-cover rounded-2xl transition-transform duration-300"
      />
      <div
        className={`absolute bottom-4 right-4 transition-all duration-300 ${
          isDragging ? "opacity-0" : "opacity-100"
        }`}
      >
        <img src={images.gallery?.src} alt="Reorder" className="w-9 h-9" />
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

const UpdateGalleryContent: FC = () => {
  const dispatch = useDispatch();

  const [galleryImages, setGalleryImages] =
    useState<GalleryImage[]>(dummyImages);

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...galleryImages];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setGalleryImages(newImages);
  };

  const handleSave = () => {};

  const mainImage = galleryImages[0];
  const thumbnailImages = galleryImages.slice(1);

  return (
    <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
      <div className="space-y-6">
        <div className="md:hidden space-y-6">
          <DraggableImage
            image={mainImage}
            index={0}
            moveImage={moveImage}
            isMain
          />

          <div className="grid grid-cols-2 gap-4">
            {thumbnailImages.map((image, index) => {
              const actualIndex = index + 1;
              return (
                <DraggableImage
                  key={image.id}
                  image={image}
                  index={actualIndex}
                  moveImage={moveImage}
                />
              );
            })}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          <div className="transition-all duration-300">
            <DraggableImage
              image={mainImage}
              index={0}
              moveImage={moveImage}
              isMain
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {thumbnailImages.map((image, index) => {
              const actualIndex = index + 1;
              return (
                <DraggableImage
                  key={image.id}
                  image={image}
                  index={actualIndex}
                  moveImage={moveImage}
                />
              );
            })}
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const UpdateGallery: FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <UpdateGalleryContent />
    </DndProvider>
  );
};

export default UpdateGallery;
