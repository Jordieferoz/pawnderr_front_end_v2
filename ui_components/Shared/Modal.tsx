"use client";

import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { X } from "lucide-react";
import { ReactNode, useCallback } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: ReactNode;
  className?: string;
}

const Modal = ({ open, setOpen, content, className }: ModalProps) => {
  const isMobile = useIsMobile();

  // Separate handler for close button - always allow closing via button
  const handleCloseButton = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className={`flex h-auto max-h-[100vh] flex-col !rounded-t-2xl bg-white px-8 py-4 sm:px-6 ${className || ""} pt-0`}
        >
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
