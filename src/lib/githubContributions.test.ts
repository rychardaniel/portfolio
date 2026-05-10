import { describe, expect, it } from 'vitest'
import {
	buildFallbackContributions,
	getContributionLevel,
	normalizeContributionWeeks,
} from './githubContributions'

describe('githubContributions', () => {
	it('normalizes GitHub weeks into client contribution cells', () => {
		const result = normalizeContributionWeeks(
			'rychardaniel',
			[
				{
					firstDay: '2026-05-03',
					contributionDays: [
						{ date: '2026-05-03', contributionCount: 0, color: '#ebedf0' },
						{ date: '2026-05-04', contributionCount: 4, color: '#40c463' },
						{ date: '2026-05-05', contributionCount: 11, color: '#216e39' },
					],
				},
			],
			15,
			'github',
			'2026-05-10T12:00:00.000Z',
		)

		expect(result).toEqual({
			username: 'rychardaniel',
			totalContributions: 15,
			source: 'github',
			updatedAt: '2026-05-10T12:00:00.000Z',
			weeks: [
				{
					firstDay: '2026-05-03',
					days: [
						{ date: '2026-05-03', count: 0, level: 0, color: '#ebedf0' },
						{ date: '2026-05-04', count: 4, level: 2, color: '#40c463' },
						{ date: '2026-05-05', count: 11, level: 4, color: '#216e39' },
					],
				},
			],
		})
	})

	it('builds a bounded fallback grid with stable dates and synthetic activity', () => {
		const result = buildFallbackContributions(
			'rychardaniel',
			new Date('2026-05-10T12:00:00.000Z'),
			2,
		)

		expect(result.source).toBe('fallback')
		expect(result.username).toBe('rychardaniel')
		expect(result.weeks).toHaveLength(2)
		expect(result.weeks.every((week) => week.days.length === 7)).toBe(true)
		expect(result.weeks[0].days[0].date).toBe('2026-04-27')
		expect(result.weeks[1].days[6].date).toBe('2026-05-10')
		expect(result.totalContributions).toBeGreaterThan(0)
	})

	it('maps contribution counts to five visual levels', () => {
		expect(getContributionLevel(0)).toBe(0)
		expect(getContributionLevel(1)).toBe(1)
		expect(getContributionLevel(3)).toBe(2)
		expect(getContributionLevel(6)).toBe(3)
		expect(getContributionLevel(10)).toBe(4)
	})
})
