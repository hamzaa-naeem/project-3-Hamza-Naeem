import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ msg:'', type:'', show:false });
  const timer = useRef(null);

  const showToast = useCallback((msg, type='default') => {
    clearTimeout(timer.current);
    setToast({ msg, type, show: true });
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }, []);

  return { toast, showToast };
}
