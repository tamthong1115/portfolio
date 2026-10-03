import { useSyncExternalStore } from 'react';

let currentLenis = null;
const listeners = new Set();

export function setLenisInstance(instance) {
  currentLenis = instance;
  listeners.forEach((listener) => listener());
}

export function getLenisInstance() {
  return currentLenis;
}

function subscribe(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return currentLenis;
}

function getServerSnapshot() {
  return null;
}

export function useLenis() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useLenis;
