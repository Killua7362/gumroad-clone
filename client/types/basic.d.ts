declare module '*.css';
declare module 'nprogress';

interface pupilPos {
  left: string;
  top: string;
}

interface sortConfig {
  active: boolean;
  byType: string;
  reverse: boolean;
}

interface searchConfig {
  active: boolean;
  startsWith: string;
}

interface toastMessage {
  active: boolean;
  message?: string;
}

interface ProductsCardContextMenu {
  active: boolean;
  activeIdx: number;
}

interface IndividualCollab {
  email: string;
  share: number;
  approved: boolean;
}

interface ProductContetPage {
  name: string;
  content: string;
}

interface ProductType {
  title: string;
  tags: string;
  live: boolean;
  currency_code: string;
  price: number;
  collab_active: boolean;
  collabs?: IndividualCollab[];
  thumbimageSource?: string;
  coverimageSource?: string;
  description: string;
  summary: string;
  contents?: ProductContetPage[];
  created_at?: string;
  updated_at?: string;
}

type ProductTypePayload = Record<string, ProductType>;

interface authSchema {
  logged_in: boolean;
  email?: string;
  name?: string;
  user_id?: string;
}

type Entries<T> = {
  [K in keyof T]: [key: K, value: T[K]];
}[keyof T][];

interface PageSchema {
  name: string;
  content: string;
}

interface ReactFormProps<T extends import('react-hook-form').FieldValues> {
  handleSubmit: import('react-hook-form').UseFormHandleSubmit<T>;
  errors: import('react-hook-form').FieldErrors<T>;
  register: import('react-hook-form').UseFormRegister<T>;
  setValue: import('react-hook-form').UseFormSetValue<T>;
  reset: import('react-hook-form').UseFormReset<T>;
  setError: import('react-hook-form').UseFormSetError<T>;
  watch: import('react-hook-form').UseFormWatch<T>;
  control: import('react-hook-form').Control<T>;
  trigger: import('react-hook-form').UseFormTrigger<T>;
  resetField: import('react-hook-form').UseFormResetField<T>;
  isDirty: boolean;
  getValues: import('react-hook-form').UseFormGetValues;
}

interface Review {
  reviewEdit: boolean;
  reviewScore: number;
  tempReviewScore: number;
  tempSelectReviewScore: number;
  reviewDescription: string;
  tempReviewDescription: string;
}

interface linkShortcutsSchema {
  name: string;
  link: string;
  absolute: boolean;
  newTab: boolean;
}
