import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Project } from '../types/portfolio'

/* ── ProjectCard ───────────────────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null)

    /* Rotation values (deg) */
    const rotX = useMotionValue(0)
    const rotY = useMotionValue(0)
    const rx = useSpring(rotX, { stiffness: 260, damping: 28 })
    const ry = useSpring(rotY, { stiffness: 260, damping: 28 })

    /* Glow position (0–100%) for the radial gradient */
    const glowX = useMotionValue(50)
    const glowY = useMotionValue(50)
    const glowBg = useMotionTemplate`radial-gradient(circle 200px at ${glowX}% ${glowY}%, rgba(37,99,235,0.10), transparent 70%)`

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current
        if (!card) return
        const r = card.getBoundingClientRect()

        /* nx, ny ∈ [−1, 1] normalizado pelo centro do card */
        const nx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
        const ny = (e.clientY - r.top - r.height / 2) / (r.height / 2)

        /*
         * rotateX: inclinação vertical — mouse acima do centro → card inclina para cima
         *   -ny * maxDeg  (invertido porque Y cresce para baixo)
         * rotateY: inclinação horizontal — mouse à direita → borda direita para frente
         *   +nx * maxDeg
         */
        rotX.set(-ny * 7)
        rotY.set(nx * 7)

        glowX.set(((e.clientX - r.left) / r.width) * 100)
        glowY.set(((e.clientY - r.top) / r.height) * 100)
    }

    const onLeave = () => {
        rotX.set(0)
        rotY.set(0)
        glowX.set(50)
        glowY.set(50)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.14, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            style={{ perspective: 1000 }}
        >
            <motion.article
                ref={cardRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
                className="group relative flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-400/30 transition-colors duration-300"
            >
                {/* Glow overlay — reage ao mouse */}
                <motion.div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-300 rounded-2xl"
                    style={{ background: glowBg }}
                />

                {/* Image */}
                <div className="md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 flex flex-col justify-center p-6 md:p-8 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-mono text-blue-600/50 dark:text-blue-400/40 tracking-widest select-none">
                            {String(project.id).padStart(2, '0')}
                        </span>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700/60" />
                    </div>

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
                            className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-150"
                        />
                    </a>
                </div>
            </motion.article>
        </motion.div>
    )
}

/* ── Section ───────────────────────────────────────────────────────────────── */

interface ProjectsProps {
    projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
    return (
        <section id="projetos" className="relative bg-slate-50 dark:bg-slate-900/50 py-24 overflow-hidden">
            {/* Subtle background grid */}
            <div
                aria-hidden
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgb(37 99 235) 1px, transparent 1px),
                        linear-gradient(90deg, rgb(37 99 235) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
                >
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        <p className="text-xs font-mono font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                            /projetos
                        </p>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
                        O que tenho construído
                    </h2>
                </motion.div>

                <div className="mt-12 flex flex-col gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
