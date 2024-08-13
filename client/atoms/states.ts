import { linkShortcutsSchema } from '@/ui/components/sidebar/link_shortcuts';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

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

export const tileRootSchema = atom({
    key: 'TileRootSchema',
    default: {} as TileSchema,
    effects_UNSTABLE: [persistAtom],
});

export const widgetBarItems = atom({
    key: 'widgetBarItems',
    default: [] as string[],
    effects_UNSTABLE: [persistAtom],
});

export const allProductsIndexStatus = atom({
    key: 'indexeStatus',
    default: {
        indexed: true,
    },
});
