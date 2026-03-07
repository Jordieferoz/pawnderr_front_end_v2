import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./cropImage";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel
}: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-h-[600px]">
      <div className="relative flex-1 bg-black rounded-t-xl overflow-hidden min-h-[300px]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="bg-white p-4 space-y-4 rounded-b-xl">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Zoom</label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(val) => onZoomChange(val[0])}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onCancel}
            className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 shadow-none"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={loading}>
            {loading ? "Saving..." : "Crop & Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
