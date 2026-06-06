import { autoUpdate, flip, offset, size, useFloating } from '@floating-ui/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import type { DropdownProps } from './dropdown.types';

type UseDropdownOptions = Pick<DropdownProps, 'options' | 'value' | 'onChange'>;

export function useDropdown({ options, value, onChange }: UseDropdownOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedOptionIdx, setFocusedOptionIdx] = useState<number | null>(null);

  const listboxId = useId();
  const optionIdPrefix = `${listboxId}-option`;

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedOptionIdx(null);
    triggerButtonRef.current?.focus();
  }, []);

  function handleOpen() {
    const idx = options.findIndex((option) => option.value === value);
    setFocusedOptionIdx(idx >= 0 ? idx : 0);
    setIsOpen(true);
  }

  function getNextIdx(current: number, direction: 1 | -1): number {
    let next = current + direction;
    while (next >= 0 && next < options.length) {
      if (!options[next].disabled) return next;
      next += direction;
    }
    return current;
  }

  function handleSelectOption(idx: number) {
    const option = options[idx];
    if (option && !option.disabled) {
      onChange(option.value);
      handleClose();
    }
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    const opensKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
    if (!opensKeys.includes(e.key)) return;
    e.preventDefault();
    handleOpen();
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedOptionIdx((prev) => getNextIdx(prev ?? -1, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedOptionIdx((prev) => getNextIdx(prev ?? options.length, -1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedOptionIdx !== null) handleSelectOption(focusedOptionIdx);
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
      case 'Tab':
        handleClose();
        break;
    }
  }

  // focusedOptionIdx가 바뀔 때 해당 항목을 스크롤 뷰 안으로 이동
  useEffect(() => {
    if (isOpen && focusedOptionIdx !== null) {
      itemRefs.current[focusedOptionIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedOptionIdx, isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const clickedOutsideTrigger = !triggerButtonRef.current?.contains(e.target as Node);
      const clickedOutsideListbox = !listboxRef.current?.contains(e.target as Node);
      if (clickedOutsideTrigger && clickedOutsideListbox) handleClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  return {
    isOpen,
    focusedOptionIdx,
    listboxId,
    optionIdPrefix,
    floatingStyles,
    triggerButtonRef,
    listboxRef,
    itemRefs,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    handleOpen,
    handleClose,
    handleTriggerKeyDown,
    handleListKeyDown,
    handleSelectOption,
  };
}
