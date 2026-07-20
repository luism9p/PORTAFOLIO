import { useState } from 'react';

// Single-open accordion — opening one item closes any other.
export function useAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return { openIndex, toggle };
}
