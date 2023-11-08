import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { VideoUpload } from "./VideoUpload";

export const UploadVideoButton = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      <Button variant="brand" onClick={onOpen}>
        Upload video file
      </Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <ModalCloseButton />
            <VideoUpload />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
