import { useCallback, useState } from 'react';

interface UseProfileFormOptions {
  initialColorIndex?: number;
  initialNickname?: string;
}

export function useProfileForm({
  initialColorIndex = 0,
  initialNickname = '',
}: UseProfileFormOptions = {}) {
  const [colorIndex, setColorIndex] = useState(initialColorIndex);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);

  const isColorChanged = colorIndex !== initialColorIndex;

  const canSubmit = initialNickname
    ? (isNicknameChanged && isNicknameValid) || isColorChanged
    : isNicknameValid;

  const handleNicknameChange = useCallback((isValid: boolean, isChanged: boolean) => {
    setIsNicknameValid(isValid);
    setIsNicknameChanged(isChanged);
  }, []);

  return { colorIndex, setColorIndex, canSubmit, handleNicknameChange };
}
