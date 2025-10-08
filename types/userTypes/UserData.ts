export type UserData = {
	id: number
	role: string
	fname: string | null
	lname: string | null
	email: string
	passwordHash: string
	new_login: boolean
	emailVerified: boolean
	contact_details: any // JsonValue from Prisma
	image_url: string | null
	concession_id: number | null
	createdAt: Date
	updatedAt: Date
}
