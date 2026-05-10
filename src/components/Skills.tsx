import { motion } from 'framer-motion'
import SkillNetworkCanvas from './SkillNetworkCanvas'
import type { Skill } from '../types/portfolio'

const LABELS: Record<string, string> = {
	frontend: 'Frontend',
	language: 'Linguagem',
	backend: 'Backend',
	database: 'Banco de Dados',
	tools: 'Ferramentas',
}

const COLORS: Record<string, string> = {
	frontend: '#60a5fa',
	language: '#a78bfa',
	backend: '#34d399',
	database: '#fb923c',
	tools: '#94a3b8',
}

interface SkillsProps {
	skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
	const categories = Array.from(new Set(skills.map((skill) => skill.category)))

	return (
		<section
			id="habilidades"
			className="relative overflow-hidden bg-slate-950 py-24 text-slate-100"
		>
			<div className="terminal-grid-bg opacity-60" aria-hidden />
			<div className="relative z-10 mx-auto max-w-6xl px-6">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.55 }}
					className="mb-10 max-w-2xl"
				>
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
						/habilidades
					</p>
					<h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
						Mapa de tecnologias
					</h2>
					<p className="mt-3 text-sm leading-6 text-slate-400">
						Um grafo leve de tecnologias conectadas por proximidade. No desktop, o
						ponteiro afeta os nós em tempo real.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.65, delay: 0.12 }}
					className="terminal-panel relative overflow-hidden"
				>
					<SkillNetworkCanvas skills={skills} />
					<div className="absolute bottom-4 right-4 flex max-w-[calc(100%-2rem)] flex-wrap justify-end gap-x-4 gap-y-2">
						{categories.map((category) => (
							<div key={category} className="flex items-center gap-1.5">
								<span
									className="h-1.5 w-1.5 rounded-full"
									style={{ backgroundColor: COLORS[category] }}
								/>
								<span className="font-mono text-[10px] text-slate-500">
									{LABELS[category] ?? category}
								</span>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
