import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import GithubContributionGrid from './GithubContributionGrid'
import { useGsapScroll } from '../hooks/useGsapScroll'
import type { Portfolio } from '../types/portfolio'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#$'

function useScramble(text: string, duration: number, delay: number) {
	const [output, setOutput] = useState(() => scramble(text, 0))

	useEffect(() => {
		let raf = 0
		let start = 0
		const timer = window.setTimeout(() => {
			const tick = (time: number) => {
				if (!start) start = time
				const progress = Math.min((time - start) / duration, 1)
				setOutput(scramble(text, progress))
				if (progress < 1) raf = requestAnimationFrame(tick)
			}

			raf = requestAnimationFrame(tick)
		}, delay)

		return () => {
			window.clearTimeout(timer)
			cancelAnimationFrame(raf)
		}
	}, [delay, duration, text])

	return output
}

function scramble(text: string, progress: number) {
	const resolved = Math.floor(text.length * progress)

	return text
		.split('')
		.map((char, index) => {
			if (char === ' ' || index < resolved) return char
			return CHARS[Math.floor(Math.random() * CHARS.length)]
		})
		.join('')
}

function getCurrentSemester(startYear: number, startSemester: 1 | 2, total: number) {
	const now = new Date()
	const currentSemester = now.getMonth() < 6 ? 1 : 2

	return Math.min(
		Math.max((now.getFullYear() - startYear) * 2 + (currentSemester - startSemester) + 1, 1),
		total,
	)
}

interface HeroTerminalProps {
	data: Portfolio
}

export default function HeroTerminal({ data }: HeroTerminalProps) {
	const sectionRef = useRef<HTMLElement>(null)
	const profileHeadingRef = useRef<HTMLDivElement>(null)
	const gridRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const name = data.name.toUpperCase()
	const scrambledName = useScramble(name, 1200, 180)
	const scrambledRole = useScramble(data.role, 900, 900)
	const semester = getCurrentSemester(
		data.education.startYear,
		data.education.startSemester,
		data.education.totalSemesters,
	)
	const progress = Math.round((semester / data.education.totalSemesters) * 100)
	const githubPathParts = data.social.github?.split('/').filter(Boolean) ?? []
	const githubUsername = githubPathParts[githubPathParts.length - 1] ?? 'rychardaniel'

	useGsapScroll(({ gsap, ScrollTrigger, reducedMotion }) => {
		if (reducedMotion || !sectionRef.current) return

		const mm = gsap.matchMedia()

		mm.add('(min-width: 768px)', () => {
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=115%',
					scrub: 0.9,
					pin: true,
					anticipatePin: 1,
				},
			})

			timeline
				.to(profileHeadingRef.current, { yPercent: -14, scale: 0.94, opacity: 0.82 }, 0)
				.to(gridRef.current, { yPercent: -8, opacity: 1 }, 0)
				.to(panelRef.current, { yPercent: 12, rotateX: -3 }, 0)

			return () => {
				timeline.kill()
				ScrollTrigger.getAll().forEach((trigger) => {
					if (trigger.trigger === sectionRef.current) trigger.kill()
				})
			}
		})

		mm.add('(max-width: 767px)', () => {
			gsap.fromTo(
				gridRef.current,
				{ opacity: 0.45, y: 28 },
				{
					opacity: 1,
					y: 0,
					scrollTrigger: {
						trigger: gridRef.current,
						start: 'top 88%',
						end: 'top 55%',
						scrub: 0.6,
					},
				},
			)

			return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
		})

		return () => mm.revert()
	}, [])

	return (
		<section
			ref={sectionRef}
			id="sobre"
			className="terminal-hero relative min-h-screen overflow-hidden bg-white pt-20 text-slate-900 dark:bg-[#050505] dark:text-slate-100"
		>
			<div className="terminal-grid-bg" aria-hidden />
			<div className="terminal-scanline" aria-hidden />

			<div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl grid-cols-1 content-center gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
				<div className="flex min-w-0 flex-col justify-center">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45 }}
						className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500"
					>
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
						render portfolio --profile rychard
					</motion.div>

					<div ref={profileHeadingRef} className="flex items-center gap-5">
						<img
							src={data.photo}
							alt={`Foto de ${data.name}`}
							className="h-20 w-20 rounded-full border border-blue-300/55 object-cover shadow-[0_0_36px_rgba(37,99,235,0.26)] sm:h-24 sm:w-24 lg:h-28 lg:w-28"
						/>
						<h1
							className="glitch-text max-w-[11ch] text-[clamp(2rem,10vw,2.5rem)] font-bold leading-[0.9] text-slate-900 md:text-5xl lg:text-6xl dark:text-slate-50"
							data-text={name}
							aria-label={data.name}
						>
							{scrambledName}
						</h1>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, delay: 0.55 }}
						className="mt-7 max-w-xl border-l border-blue-400/35 pl-5"
					>
						<p className="font-mono text-sm text-blue-700 dark:text-blue-300">
							&gt; {scrambledRole}
							<span className="text-slate-500"> @ </span>
							<a
								href={data.company.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-500 dark:hover:text-blue-200"
							>
								{data.company.name}
							</a>
						</p>
						<p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
							{data.bio}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, delay: 0.75 }}
						className="mt-7 flex flex-wrap gap-3"
					>
						{data.social.github && (
							<a
								href={data.social.github}
								target="_blank"
								rel="noopener noreferrer"
								className="terminal-button"
							>
								<GithubIcon size={16} />
								GitHub
							</a>
						)}
						{data.social.linkedin && (
							<a
								href={data.social.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="terminal-button"
							>
								<LinkedinIcon size={16} />
								LinkedIn
							</a>
						)}
						<a
							href="mailto:contato@rychard.dev"
							className="terminal-button terminal-button-primary"
						>
							<ExternalLink size={16} />
							Contato
						</a>
					</motion.div>
				</div>

				<div
					ref={panelRef}
					className="hero-panel-wrap flex min-w-0 flex-col justify-center gap-4"
				>
					<div className="terminal-panel overflow-hidden">
						<div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/70">
							<div className="flex gap-1.5">
								<span className="h-2 w-2 rounded-full bg-red-400/80" />
								<span className="h-2 w-2 rounded-full bg-amber-400/80" />
								<span className="h-2 w-2 rounded-full bg-emerald-400/80" />
							</div>
							<span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
								system state
							</span>
						</div>
						<div className="grid gap-4 p-4 sm:grid-cols-2">
							<div>
								<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
									education
								</p>
								<p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
									{data.education.course}
								</p>
								<div className="mt-4 h-px bg-slate-200 dark:bg-slate-800">
									<div
										className="h-px bg-blue-600 dark:bg-blue-300"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<p className="mt-2 font-mono text-xs text-blue-700 dark:text-blue-300">
									{semester}/{data.education.totalSemesters} sem. · {progress}%
								</p>
							</div>
							<div className="terminal-stat-grid">
								<span>react</span>
								<span>typescript</span>
								<span>asp.net</span>
								<span>crm systems</span>
							</div>
						</div>
					</div>

					<div ref={gridRef} className="min-w-0">
						<GithubContributionGrid username={githubUsername} />
					</div>
				</div>
			</div>
		</section>
	)
}
