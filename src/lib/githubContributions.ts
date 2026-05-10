export type ContributionSource = 'github' | 'fallback'

export interface GithubContributionDay {
	date: string
	contributionCount: number
	color?: string
}

export interface GithubContributionWeek {
	firstDay: string
	contributionDays: GithubContributionDay[]
}

export interface ContributionDay {
	date: string
	count: number
	level: 0 | 1 | 2 | 3 | 4
	color?: string
}

export interface ContributionWeek {
	firstDay: string
	days: ContributionDay[]
}

export interface ContributionResponse {
	username: string
	totalContributions: number
	source: ContributionSource
	updatedAt: string
	weeks: ContributionWeek[]
}

const FALLBACK_LEVELS = [0, 1, 2, 3, 4, 2, 1, 0, 3, 1, 2, 0, 4, 1]

export function getContributionLevel(count: number): ContributionDay['level'] {
	if (count <= 0) return 0
	if (count <= 2) return 1
	if (count <= 5) return 2
	if (count <= 9) return 3
	return 4
}

export function normalizeContributionWeeks(
	username: string,
	weeks: GithubContributionWeek[],
	totalContributions: number,
	source: ContributionSource,
	updatedAt = new Date().toISOString(),
): ContributionResponse {
	return {
		username,
		totalContributions: Math.max(0, totalContributions),
		source,
		updatedAt,
		weeks: weeks.map((week) => ({
			firstDay: week.firstDay,
			days: week.contributionDays.map((day) => {
				const count = Math.max(0, day.contributionCount)

				return {
					date: day.date,
					count,
					level: getContributionLevel(count),
					color: day.color,
				}
			}),
		})),
	}
}

export function buildFallbackContributions(
	username: string,
	now = new Date(),
	weekCount = 26,
): ContributionResponse {
	const end = startOfDay(now)
	const start = new Date(end)
	start.setDate(end.getDate() - weekCount * 7 + 1)

	const weeks: ContributionWeek[] = []
	let totalContributions = 0

	for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
		const weekStart = new Date(start)
		weekStart.setDate(start.getDate() + weekIndex * 7)

		const days: ContributionDay[] = []

		for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
			const date = new Date(weekStart)
			date.setDate(weekStart.getDate() + dayIndex)
			const level = FALLBACK_LEVELS[
				(weekIndex * 3 + dayIndex * 5) % FALLBACK_LEVELS.length
			] as ContributionDay['level']
			const count = level === 0 ? 0 : level * 2 + ((weekIndex + dayIndex) % 2)
			totalContributions += count

			days.push({
				date: toDateKey(date),
				count,
				level,
			})
		}

		weeks.push({
			firstDay: toDateKey(weekStart),
			days,
		})
	}

	return {
		username,
		totalContributions,
		source: 'fallback',
		updatedAt: end.toISOString(),
		weeks,
	}
}

function startOfDay(date: Date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function toDateKey(date: Date) {
	return date.toISOString().slice(0, 10)
}
