import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Project } from '../types/portfolio'

interface ProjectDeckProps {
	projects: Project[]
}

export default function ProjectDeck({ projects }: ProjectDeckProps) {
	return (
		<div className="mt-12 grid gap-5">
			{projects.map((project, index) => (
				<ProjectCard key={project.id} project={project} index={index} />
			))}
		</div>
	)
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
	const cardRef = useRef<HTMLElement>(null)
	const rotateX = useMotionValue(0)
	const rotateY = useMotionValue(0)
	const glowX = useMotionValue(50)
	const glowY = useMotionValue(50)
	const rx = useSpring(rotateX, { stiffness: 260, damping: 28 })
	const ry = useSpring(rotateY, { stiffness: 260, damping: 28 })
	const glow = useMotionTemplate`radial-gradient(circle 240px at ${glowX}% ${glowY}%, rgba(96,165,250,0.16), transparent 70%)`

	const handleMove = (event: React.MouseEvent<HTMLElement>) => {
		if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
		const card = cardRef.current
		if (!card) return

		const rect = card.getBoundingClientRect()
		const x = (event.clientX - rect.left) / rect.width
		const y = (event.clientY - rect.top) / rect.height

		rotateX.set((0.5 - y) * 8)
		rotateY.set((x - 0.5) * 8)
		glowX.set(x * 100)
		glowY.set(y * 100)
	}

	const handleLeave = () => {
		rotateX.set(0)
		rotateY.set(0)
		glowX.set(50)
		glowY.set(50)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 34 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{ duration: 0.58, delay: index * 0.12, ease: [0, 0, 0.2, 1] }}
			style={{ perspective: 1000 }}
		>
			<motion.article
				ref={cardRef}
				onMouseMove={handleMove}
				onMouseLeave={handleLeave}
				style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
				className="terminal-project-card group relative grid overflow-hidden rounded-[10px] border border-slate-800 bg-slate-950/85 md:grid-cols-[280px_1fr]"
			>
				<motion.div
					className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ background: glow }}
				/>

				<div className="relative h-52 overflow-hidden bg-slate-900 md:h-full">
					<img
						src={project.image}
						alt={project.name}
						className="h-full w-full object-cover opacity-80 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
				</div>

				<div className="relative z-10 flex min-h-[250px] flex-col justify-center p-6 md:p-8">
					<div className="mb-4 flex items-center gap-3">
						<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300/80">
							project.{String(project.id).padStart(2, '0')}
						</span>
						<span className="h-px flex-1 bg-slate-800" />
					</div>
					<h3 className="text-2xl font-semibold text-slate-50">{project.name}</h3>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
						{project.description}
					</p>
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-flex w-fit items-center gap-2 font-mono text-sm text-blue-300 transition-colors hover:text-blue-100"
					>
						abrir projeto
						<ExternalLink size={15} />
					</a>
				</div>
			</motion.article>
		</motion.div>
	)
}
