type signInSchemaType = import('zod').z.infer<
  typeof import('@/forms/schema/auth_schema').signInSchema
>;
type signUpSchemaType = import('zod').z.infer<
  typeof import('@/forms/schema/auth_schema').signUpSchema
>;
type EditProductSchemaType = import('zod').z.infer<
  typeof import('@/forms/schema/edit_product_schema').EditProductSchema
>;
type NewProductSchemaType = import('zod').z.infer<
  typeof import('@/forms/schema/new_product_schema').NewProductSchema
>;
type CheckoutFormSchemaType = import('zod').z.infer<
  typeof import('@/forms/schema/checkout_schema').CheckoutFormSchema
>;
