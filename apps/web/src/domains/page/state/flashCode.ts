import { useToast } from "@chakra-ui/react";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface FlashMessage {
  type: "success" | "error";
  message: string;
}

const flashCodes: { [key: string]: FlashMessage } = {
  loggedOutSuccess: { type: "success", message: "Successfully logged out" },
};

export const useFlashCode = () => {
  const [location, navigate] = useLocation();
  const toast = useToast();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const flashCode = query.get("flashCode");
    const flashMessage = flashCodes[flashCode];
    if (flashMessage) {
      toast({
        status: flashMessage.type,
        title: flashMessage.message,
        position: "top",
      });
      query.delete("flashCode");
      navigate(`${window.location.pathname}?${query.toString()}`);
    }
  }, [location]);
};
