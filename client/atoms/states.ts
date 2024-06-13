import { atom } from 'recoil';

export const hideToastState = atom({
  key: 'hideToastState',
  default: {
    active: true,
    message: '',
  },
});
