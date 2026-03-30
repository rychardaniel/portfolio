import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import type { Portfolio } from '../types/portfolio'

function getCurrentSemester(startYear: number, startSemester: 1 | 2, total: number): number {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentSemester = now.getMonth() < 6 ? 1 : 2
    const elapsed = (currentYear - startYear) * 2 + (currentSemester - startSemester) + 1
    return Math.min(Math.max(elapsed, 1), total)
}

const easeOut = [0.0, 0.0, 0.2, 1] as const

interface AboutProps {
    data: Portfolio
}

export default function About({ data }: AboutProps) {
    const { name, role, company, bio, photo, education, social } = data
    const currentSemester = getCurrentSemester(
        education.startYear,
        education.startSemester,
        education.totalSemesters,
    )
    const progressPercent = (currentSemester / education.totalSemesters) * 100

    return (
        <section
            id="sobre"
            className="min-h-screen flex items-center bg-white dark:bg-slate-950 pt-16"
        >
            <div className="max-w-5xl mx-auto px-6 py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: easeOut }}
                        className="flex justify-center md:justify-end order-first md:order-last"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-slate-400/20 blur-2xl scale-110" />
                            <img
                                src={photo}
                                alt={name}
                                className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                            />
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-5">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                                {name}
                            </h1>
                            <p className="mt-2 text-base md:text-lg font-medium text-blue-600 dark:text-blue-400">
                                {role} <span className="text-slate-400 dark:text-slate-500">@</span>{' '}
                                <a
                                    href={company.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline underline-offset-2"
                                >
                                    {company.name}
                                </a>
                            </p>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
                            className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base"
                        >
                            {bio}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
                            className="pt-1"
                        >
                            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                <span>
                                    {education.course} &mdash; {education.institution}
                                </span>
                                <span className="ml-4 shrink-0 text-blue-600 dark:text-blue-400">
                                    {currentSemester} / {education.totalSemesters} sem.
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${progressPercent}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: easeOut, delay: 0.4 }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
                            className="flex gap-3 pt-1"
                        >
                            {social.github && (
                                <a
                                    href={social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <GithubIcon size={16} />
                                    GitHub
                                </a>
                            )}
                            {social.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <LinkedinIcon size={16} />
                                    LinkedIn
                                </a>
                            )}
                            <a
                                href="mailto:contato@rychard.dev"
                                aria-label="E-mail"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                <ExternalLink size={16} />
                                Contato
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
