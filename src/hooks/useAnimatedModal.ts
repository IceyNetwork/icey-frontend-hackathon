import { useState, useEffect } from "react";
import { animationDuration } from "../consts/static";

export const useAnimatedModal = (isOpen: boolean) => {
  const [isMounted, setIsMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const enterTimer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(enterTimer);
    } else {
      setShow(false);
      const exitTimer = setTimeout(
        () => setIsMounted(false),
        animationDuration
      );
      return () => clearTimeout(exitTimer);
    }
  }, [isOpen]);

  return { isMounted, show };
};
