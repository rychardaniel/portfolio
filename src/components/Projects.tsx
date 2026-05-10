import { motion } from 'framer-motion'
import ProjectDeck from './ProjectDeck'
import type { Project } from '../types/portfolio'

interface ProjectsProps {
	projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
	return (
		<section
			id="projetos"
			className="relative overflow-hidden bg-white py-24 text-slate-900 dark:bg-[#070707] dark:text-slate-100"
		>
			<div className="terminal-grid-bg opacity-50" aria-hidden />
			<div className="relative z-10 mx-auto max-w-6xl px-6">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.55 }}
					className="max-w-2xl"
				>
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
						/experiência-projetos
					</p>
					<h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-50">
						Sistemas em produção
					</h2>
					<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
						Projetos com foco em utilidade, clareza e interfaces que continuam simples
						mesmo quando o domínio cresce.
					</p>
				</motion.div>

				<ProjectDeck projects={projects} />
			</div>
		</section>
	)
}
