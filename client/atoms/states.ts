import { linkShortcutsSchema } from '@/ui/components/sidebar/link_shortcuts';
import { atom, selector } from 'recoil';

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

export const tileRootSchemaPopulator = selector({
  key: 'tileRootSchemaPopulator',
  get: ({ get }) => {
    const defaultSchema: TileSchema = {};
    const tilingSchema: TileSchema =
      JSON.parse(localStorage.getItem('tiling_schema') || '{}') ??
      defaultSchema;
    return tilingSchema;
  },
  set: ({ get, set }, tilingSchema: TileSchema) => {
    set(tileRootSchema, tilingSchema);
    localStorage.setItem('tiling_schema', JSON.stringify(tilingSchema));
  },
});

export const tileRootSchema = atom({
  key: 'TileRootSchema',
  default: tileRootSchemaPopulator,
});

export const widgetBarItems = atom({
  key: 'widgetBarItems',
  default: [] as string[],
});
