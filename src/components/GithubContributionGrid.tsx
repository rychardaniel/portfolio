import { useEffect, useMemo, useState } from 'react'
import { buildFallbackContributions, type ContributionResponse } from '../lib/githubContributions'

interface GithubContributionGridProps {
	username: string
}

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

	const visibleWeeks = useMemo(() => data.weeks.slice(-30), [data.weeks])

	return (
		<div className="terminal-panel github-grid-panel">
			<div className="flex items-center justify-between gap-4 border-b border-slate-700/70 px-4 py-3">
				<div>
					<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
						github activity
					</p>
					<p className="mt-1 text-sm font-medium text-slate-200">
						{data.totalContributions.toLocaleString('pt-BR')} contribuições
					</p>
				</div>
				<span className="rounded-full border border-slate-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
					{status === 'loading' ? 'sync' : status}
				</span>
			</div>

			<div className="overflow-hidden px-4 py-4">
				<div className="github-grid" aria-label={`Contribuições recentes de ${username}`}>
					{visibleWeeks.map((week) => (
						<div key={week.firstDay} className="grid gap-[4px]">
							{week.days.map((day) => (
								<div
									key={day.date}
									title={`${day.date}: ${day.count} contribuição(ões)`}
									className="github-cell"
									data-level={day.level}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
