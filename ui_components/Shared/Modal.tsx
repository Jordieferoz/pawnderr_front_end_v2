"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { X } from "lucide-react";
import { FC, ReactNode, useCallback } from "react";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: ReactNode;
  className?: string;
}

const Modal: FC<ModalProps> = ({ open, setOpen, content, className }) => {
  const isMobile = useIsMobile();

  // Separate handler for close button - always allow closing via button
  const handleCloseButton = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className={``}>
          {/* Fixed Header */}
          <DrawerHeader
            className={`relative flex flex-shrink-0 justify-center`}
          >
            <button
              onClick={handleCloseButton}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#333333] transition"
            >
              <X size={24} />
            </button>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={className}>
        <div className="pt-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
