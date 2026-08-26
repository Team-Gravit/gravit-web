import { useEffect, useState } from 'react';
import { z } from 'zod';

const nicknameSchema = z
  .string()
  .min(2)
  .max(8)
  .regex(/^[가-힣a-zA-Z0-9]+$/);

interface UseNicknameFormOptions {
  initialNickname?: string;
  onSubmit: (nickname: string) => void;
  onValidityChange?: (isValid: boolean) => void;
}

function useNicknameForm({
  initialNickname = '',
  onSubmit,
  onValidityChange,
}: UseNicknameFormOptions) {
  const [nickname, setNickname] = useState(initialNickname);
  const [isValid, setIsValid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!nickname) {
      setIsValid(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    const handler = setTimeout(() => {
      setIsValid(nicknameSchema.safeParse(nickname).success);
      setChecking(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [nickname]);

  useEffect(() => {
    onValidityChange?.(isValid && !checking);
  }, [isValid, checking, onValidityChange]);

  const handleChange = (value: string) => {
    if (!isDirty) setIsDirty(true);
    setNickname(value);
  };

  const handleSubmit = () => {
    onSubmit(nickname.trim());
  };

  return {
    nickname,
    setNickname,
    handleChange,
    isValid,
    checking,
    isDirty,
    handleSubmit,
  };
}

export default useNicknameForm;
