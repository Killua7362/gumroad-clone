import { z } from 'zod'

export const productTypeOptions = [
	{ value: 'productivity', label: 'Productivity' },
	{ value: 'fitness', label: 'Fitness' },
	{ value: 'programming', label: 'Programming' },
]

const CollabSchema = z.object({
	email: z.string().email(),
	share: z.coerce.number().min(0).max(100),
	approved: z.boolean().optional().default(false)
})

const ContentSchema = z.object({
	name: z.string(),
	content: z.string()
})

export const EditProductSchema = z.object({
	title: z.string().min(2).max(30),
	price: z.coerce.number().min(0),
	currency_code: z.string().default('USD'),
	summary: z.string().min(10),
	description: z.string().min(10),
	collab_active: z.boolean().default(false),
	collabs: z.array(CollabSchema).superRefine((data, ctx) => {
		if (data.reduce((a, { share }) => a + (Number(share) || 0), 0) > 100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Sum of shares should add upto 100'
			})
		}

		if (new Set(data.map(e => e.email)).size < data.length) {
			ctx.addIssue({
				message: 'Duplicate users detected',
				code: z.ZodIssueCode.custom
			})
		}
	}),
	contents: z.array(ContentSchema),
	tags: z.string().superRefine((data, ctx) => {
		if (!data) {
			ctx.addIssue({
				message: 'Choose atleast one type',
				code: z.ZodIssueCode.custom
			})
			return;
		}
		const stringArray: string[] = data.trim().split(',')
		const validateArray: string[] = productTypeOptions.map(d => d.value)

		for (let i = 0; i < stringArray.length; i++) {
			if (!(validateArray.includes(stringArray[i]))) {
				ctx.addIssue({
					message: `${stringArray[i]} type does not exist`,
					code: z.ZodIssueCode.custom
				})
				break;
			}
		}
	})
})
