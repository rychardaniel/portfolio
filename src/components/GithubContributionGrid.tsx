import { useEffect, useMemo, useState } from 'react'
import {
	buildFallbackContributions,
	type ContributionResponse,
	type ContributionWeek,
} from '../lib/githubContributions'

interface GithubContributionGridProps {
	username: string
}

const MONTH_LABELS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]
const FULL_MONTH_LABELS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]
const WEEKDAY_LABELS = [
	{ label: 'Mon', row: 2 },
	{ label: 'Wed', row: 4 },
	{ label: 'Fri', row: 6 },
]

export default function GithubContributionGrid({ username }: GithubContributionGridProps) {
	const [data, setData] = useState<ContributionResponse>(() =>
		buildFallbackContributions(username),
	)
	const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')

	useEffect(() => {
		const controller = new AbortController()

		async function load() {
			try {
				const response = await fetch('/api/github/contributions', {
					signal: controller.signal,
				})

				if (!response.ok) throw new Error('github contributions unavailable')

				const next = (await response.json()) as ContributionResponse
				setData(next)
				setStatus(next.source === 'github' ? 'ready' : 'fallback')
			} catch {
				if (!controller.signal.aborted) {
					setData(buildFallbackContributions(username))
					setStatus('fallback')
				}
			}
		}

		load()

		return () => controller.abort()
	}, [username])

	const visibleWeeks = useMemo(() => data.weeks.slice(-53), [data.weeks])
	const monthLabels = useMemo(() => getMonthLabels(visibleWeeks), [visibleWeeks])

	return (
		<div className="terminal-panel github-grid-panel">
			<div className="flex items-center justify-between gap-4 border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/70">
				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
						activity on GitHub from the last year
					</p>
				</div>
				<span className="rounded-full border border-slate-200 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
					{status === 'loading' ? 'sync' : status}
				</span>
			</div>

			<div className="github-calendar-shell px-4 py-4">
				<div className="github-scroll">
					<div className="github-calendar">
						<div
							className="github-months"
							style={{
								gridTemplateColumns: `repeat(${visibleWeeks.length}, var(--github-cell-size))`,
							}}
						>
							{monthLabels.map((month) => (
								<span
									key={`${month.label}-${month.weekIndex}`}
									style={{
										gridColumn: `${month.weekIndex + 1} / span ${month.span}`,
									}}
								>
									{month.label}
								</span>
							))}
						</div>

						<div className="github-calendar-body">
							<div className="github-weekdays">
								{WEEKDAY_LABELS.map((day) => (
									<span key={day.label} style={{ gridRow: day.row }}>
										{day.label}
									</span>
								))}
							</div>

							<div
								className="github-grid"
								aria-label={`Contribuições recentes de ${username}`}
							>
								{visibleWeeks.map((week) => (
									<div key={week.firstDay} className="github-week">
										{week.days.map((day) => (
											<div
												key={day.date}
												title={formatContributionTooltip(
													day.date,
													day.count,
												)}
												className="github-cell"
												data-level={day.level}
											/>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="github-legend" aria-hidden="true">
					<span>Less</span>
					{[0, 1, 2, 3, 4].map((level) => (
						<span key={level} className="github-cell" data-level={level} />
					))}
					<span>More</span>
				</div>
			</div>
		</div>
	)
}

function formatContributionTooltip(dateKey: string, count: number) {
	const date = new Date(`${dateKey}T00:00:00Z`)
	const day = date.getUTCDate()
	const month = FULL_MONTH_LABELS[date.getUTCMonth()]
	const label = count === 1 ? 'contribution' : 'contributions'

	return `${count} ${label} on ${month} ${day}${getOrdinalSuffix(day)}.`
}

function getOrdinalSuffix(day: number) {
	const lastTwoDigits = day % 100
	if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th'

	switch (day % 10) {
		case 1:
			return 'st'
		case 2:
			return 'nd'
		case 3:
			return 'rd'
		default:
			return 'th'
	}
}

function getMonthLabels(weeks: ContributionWeek[]) {
	const labels = weeks.reduce<Array<{ label: string; weekIndex: number; span: number }>>(
		(acc, week, index) => {
			const firstDay = week.days[0]
			if (!firstDay) return acc

			const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth()
			const previousWeek = weeks[index - 1]
			const previousMonth = previousWeek?.days[0]
				? new Date(`${previousWeek.days[0].date}T00:00:00Z`).getUTCMonth()
				: null

			if (month !== previousMonth) {
				const previousLabel = acc[acc.length - 1]
				if (previousLabel) previousLabel.span = index - previousLabel.weekIndex

				acc.push({
					label: MONTH_LABELS[month],
					weekIndex: index,
					span: 4,
				})
			}

			return acc
		},
		[],
	)

	const last = labels[labels.length - 1]
	if (last) last.span = weeks.length - last.weekIndex

	return labels
}
