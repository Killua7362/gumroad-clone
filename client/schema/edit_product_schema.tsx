import { z } from 'zod'

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
	collab: z.array(CollabSchema).superRefine((data, ctx) => {
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
	})
})
