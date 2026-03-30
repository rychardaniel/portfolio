export interface Company {
	name: string
	url: string
}

export interface Education {
	course: string
	institution: string
	startYear: number
	startSemester: 1 | 2
	totalSemesters: number
}

export interface Social {
	github?: string
	linkedin?: string
}

export interface Project {
	id: number
	name: string
	description: string
	image: string
	link: string
}

export interface Portfolio {
	name: string
	role: string
	company: Company
	bio: string
	photo: string
	education: Education
	social: Social
	projects: Project[]
}
