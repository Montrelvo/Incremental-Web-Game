import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
const KEY = 'spark-workshop-v1';
/** Native Preferences on mobile; browser storage on web and sandboxed desktop. */
export const storage = {
  async read(): Promise<string | null> {
    return Capacitor.isNativePlatform() ? (await Preferences.get({ key: KEY })).value : localStorage.getItem(KEY);
  },
  async write(value: string) {
    if (Capacitor.isNativePlatform()) await Preferences.set({ key: KEY, value });
    else localStorage.setItem(KEY, value);
  },
};
