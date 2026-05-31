'use client';

import { useServiceWorker } from '@/hooks/useServiceWorker';

export function ServiceWorkerRegistrar() {
  useServiceWorker();
  return null;
}
