import { atom } from 'recoil';

export const hideToastState = atom({
  key: 'hideToastState',
  default: {
    active: true,
    message: '',
  },
});

export const sidebarShortcutLinks = atom({
  key: 'sidebarShortcutLinks',
  default: [] as linkShortcutsSchema[],
});
