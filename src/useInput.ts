import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import useDebounce from './useDebounce';

interface UseInputProps {
  initValue?: string;
  maxLength?: number;
  minLength?: number;
  autoFix?: boolean;
  validation?: RegExp;
  blockLineBreak?: boolean;
  handleTrimText?: (text: string) => string;
  setInputValue?: (text: string) => void;
}

export const useInput = ({
  initValue,
  maxLength = 0,
  minLength,
  autoFix = true,
  blockLineBreak = false,
  validation,
  handleTrimText,
  setInputValue,
}: UseInputProps) => {
  const [value, setValue] = useState<string>(initValue || '');
  const debouncedValue = useDebounce(value, 300);
  const isValid = useRef<boolean>(false);
  const debouncedValidation = useDebounce(isValid.current, 300);

  const handleString = useCallback(
    (receivedValue: string) => {
      const returnValue: string = receivedValue;

      isValid.current = !!validation
        ? validation.test(returnValue)
        : returnValue === receivedValue &&
          returnValue.length >= (minLength ?? 0);

      setValue(returnValue);
    },
    [minLength, validation]
  );

  const onChangeInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback(
    ({ target }) => {
      const value = target.value || '';
      handleString(value);
    },
    [handleString]
  );

  const resetValue = () => {
    setValue('');
    isValid.current = false;
  };

  useEffect(() => {
    setInputValue && setInputValue(value);
  }, [value, setInputValue]);

  useEffect(() => {
    if (initValue === value) isValid.current = false;
  }, [initValue, value]);

  return {
    value,
    debouncedValue,
    onChangeInput,
    isValid: debouncedValidation,
    resetValue,
  };
};
