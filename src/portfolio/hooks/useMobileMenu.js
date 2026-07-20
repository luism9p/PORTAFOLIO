import { useState } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  function close() {
    setIsOpen(false);
  }

  return { isOpen, toggle, close };
}
