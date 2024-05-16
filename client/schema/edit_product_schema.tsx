import { z } from 'zod'

export const productTypeOptions = [
	{ value: 'Productivity', label: 'productivity' },
	{ value: 'Fitness', label: 'fitness' },
	{ value: 'Programming', label: 'programming' },
]

export const CollabSchema = z.object({
	email: z.string().email(),
	share: z.coerce.number().min(0).max(100),
	approved: z.boolean().optional().default(false)
})

export const EditProductSchema = z.object({
	title: z.string().min(2).max(30),
	price: z.coerce.number().min(0),
	summary: z.string().min(10),
	description: z.string().min(10),
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
	tags: z.string().superRefine((data, ctx) => {
		if (!data) {
			ctx.addIssue({
				message: 'Choose atleast one type',
				code: z.ZodIssueCode.custom
			})
			return;
		}
		const stringArray: string[] = data.trim().split(',')
		const validateArray: string[] = productTypeOptions.map(d => d.label)

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
