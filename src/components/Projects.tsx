import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Project } from '../types/portfolio'

const easeOut = [0.0, 0.0, 0.2, 1] as const

interface ProjectCardProps {
    project: Project
    index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easeOut, delay: index * 0.12 }}
            className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-600/40 dark:hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 transition-all duration-300"
        >
            <div className="md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="flex flex-col justify-center p-6 md:p-8 flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {project.name}
                </h3>
                <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {project.description}
                </p>
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-fit group/link"
                >
                    Ver projeto
                    <ExternalLink
                        size={14}
                        className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                    />
                </a>
            </div>
        </motion.article>
    )
}

interface ProjectsProps {
    projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
    return (
        <section id="projetos" className="bg-slate-50 dark:bg-slate-900/50 py-24">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: easeOut }}
                >
                    <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-3">
                        Projetos
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
                        O que tenho construído
                    </h2>
                </motion.div>

                <div className="mt-12 flex flex-col gap-5">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
