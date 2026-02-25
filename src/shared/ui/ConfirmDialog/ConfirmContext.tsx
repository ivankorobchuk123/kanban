import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ConfirmDialog } from './ConfirmDialog';
import type { ConfirmOptions } from './ConfirmDialog';

const ANIMATION_DURATION = 250;

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setResolver(() => (value: boolean) => resolve(value));
    });
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setOptions(null);
      setResolver(null);
      setIsClosing(false);
    }, ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    close();
  }, [resolver, close]);

  const handleCancel = useCallback(() => {
    resolver?.(false);
    close();
  }, [resolver, close]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {(options !== null || isClosing) && (
        <ConfirmDialog
          isOpen={!isClosing && options !== null}
          options={options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return ctx.confirm;
}
