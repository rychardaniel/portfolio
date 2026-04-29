import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import type { Portfolio } from '../types/portfolio'

/* ── Scramble ──────────────────────────────────────────────────────────────── */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

function useScramble(text: string, duration: number, delay: number) {
    const [out, setOut] = useState(() =>
        text.replace(/[^ ]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
    )
    useEffect(() => {
        let raf = 0
        let t0 = 0
        const start = (ts: number) => {
            if (!t0) t0 = ts
            const progress = Math.min((ts - t0) / duration, 1)
            const resolved = Math.floor(progress * text.length)
            setOut(
                text
                    .split('')
                    .map((ch, i) => {
                        if (ch === ' ') return ' '
                        if (i < resolved) return ch
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join(''),
            )
            if (progress < 1) raf = requestAnimationFrame(start)
        }
        const timer = setTimeout(() => {
            raf = requestAnimationFrame(start)
        }, delay)
        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(raf)
        }
    }, [text, duration, delay])
    return out
}

/* ── Semestre ──────────────────────────────────────────────────────────────── */

function getCurrentSemester(startYear: number, startSemester: 1 | 2, total: number) {
    const now = new Date()
    const cur = now.getMonth() < 6 ? 1 : 2
    return Math.min(Math.max((now.getFullYear() - startYear) * 2 + (cur - startSemester) + 1, 1), total)
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface AboutProps {
    data: Portfolio
}

export default function About({ data }: AboutProps) {
    const { name, role, company, bio, photo, education, social } = data

    const sem = getCurrentSemester(education.startYear, education.startSemester, education.totalSemesters)
    const progress = (sem / education.totalSemesters) * 100

    const nameUpper = name.toUpperCase()
    const scrambledName = useScramble(nameUpper, 1500, 300)
    const scrambledRole = useScramble(role, 900, 1900)

    /* ── Mouse parallax ───────────────────────────────────────────────────── */
    const sectionRef = useRef<HTMLElement>(null)
    const mx = useMotionValue(0.5)
    const my = useMotionValue(0.5)

    /* layer 1: grid — moves at ±24px */
    const g1x = useSpring(useTransform(mx, [0, 1], [-24, 24]), { stiffness: 35, damping: 14 })
    const g1y = useSpring(useTransform(my, [0, 1], [-24, 24]), { stiffness: 35, damping: 14 })
    /* layer 2: dots — moves at ±10px, slower */
    const g2x = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 25, damping: 12 })
    const g2y = useSpring(useTransform(my, [0, 1], [-10, 10]), { stiffness: 25, damping: 12 })

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return
        const onMove = (e: MouseEvent) => {
            const r = section.getBoundingClientRect()
            mx.set((e.clientX - r.left) / r.width)
            my.set((e.clientY - r.top) / r.height)
        }
        section.addEventListener('mousemove', onMove, { passive: true })
        return () => section.removeEventListener('mousemove', onMove)
    }, [mx, my])

    const ease = [0, 0, 0.2, 1] as [number, number, number, number]

    return (
        <section
            ref={sectionRef}
            id="sobre"
            className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950 pt-16"
        >
            {/* ── Grid parallax layer ── */}
            <motion.div
                aria-hidden
                className="absolute inset-[-40px] pointer-events-none"
                style={{ x: g1x, y: g1y }}
            >
                <div
                    className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgb(37 99 235) 1px, transparent 1px),
                            linear-gradient(90deg, rgb(37 99 235) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                    }}
                />
            </motion.div>

            {/* ── Accent dots layer ── */}
            <motion.div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ x: g2x, y: g2y }}
            >
                {(
                    [
                        { top: '14%', left: '9%', s: 8, o: 0.25 },
                        { top: '72%', left: '84%', s: 12, o: 0.18 },
                        { top: '38%', right: '7%', s: 6, o: 0.22 },
                        { top: '82%', left: '22%', s: 16, o: 0.12 },
                        { top: '22%', left: '76%', s: 8, o: 0.2 },
                        { top: '55%', left: '5%', s: 6, o: 0.15 },
                    ] as Array<{ top: string; left?: string; right?: string; s: number; o: number }>
                ).map((d, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-500"
                        style={{
                            top: d.top,
                            left: d.left,
                            right: d.right,
                            width: d.s,
                            height: d.s,
                            opacity: d.o,
                        }}
                    />
                ))}
            </motion.div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Photo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.5, ease }}
                        className="flex justify-center md:justify-end order-first md:order-last"
                    >
                        <div className="relative">
                            {/* Rings */}
                            <div className="absolute -inset-4 rounded-full border border-blue-500/15" />
                            <div className="absolute -inset-8 rounded-full border border-blue-500/08" />
                            {/* Corner brackets */}
                            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-blue-500/50" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-blue-500/50" />
                            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-blue-500/50" />
                            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-blue-500/50" />
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl scale-125" />
                            <img
                                src={photo}
                                alt={name}
                                className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border border-blue-500/25 dark:border-blue-400/20"
                            />
                        </div>
                    </motion.div>

                    {/* Text */}
                    <div className="flex flex-col gap-5">

                        {/* Status badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)] animate-pulse" />
                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                sys.init — online
                            </span>
                        </motion.div>

                        {/* Name — glitch + scramble */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                        >
                            <h1
                                className="glitch-text text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight"
                                data-text={nameUpper}
                                aria-label={name}
                            >
                                {scrambledName}
                            </h1>
                        </motion.div>

                        {/* Role */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.5 }}
                            className="flex items-center gap-2"
                        >
                            <span className="font-mono text-slate-400 dark:text-slate-500 text-sm select-none">
                                &gt;_
                            </span>
                            <p className="font-mono text-sm md:text-base font-medium text-blue-600 dark:text-blue-400">
                                {scrambledRole}
                                <span className="text-slate-400 dark:text-slate-500"> @ </span>
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

                        {/* Separator */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease, delay: 0.85 }}
                            className="h-px bg-slate-100 dark:bg-slate-800"
                        />

                        {/* Bio */}
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease, delay: 0.9 }}
                            className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base border-l-2 border-blue-500/30 pl-4"
                        >
                            {bio}
                        </motion.p>

                        {/* Education progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease, delay: 1.0 }}
                        >
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2.5">
                                <span className="truncate pr-2">
                                    {education.course} — {education.institution}
                                </span>
                                <span className="shrink-0 text-blue-600 dark:text-blue-400 tabular-nums">
                                    {sem}/{education.totalSemesters} sem.
                                </span>
                            </div>
                            <div className="relative h-px bg-slate-200 dark:bg-slate-800">
                                <motion.div
                                    className="absolute left-0 top-0 h-px bg-blue-600 dark:bg-blue-400"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.4, delay: 1.4, ease }}
                                />
                                <motion.div
                                    className="absolute top-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 -translate-x-1/2 shadow-[0_0_8px_2px_rgba(37,99,235,0.4)] dark:shadow-[0_0_8px_2px_rgba(96,165,250,0.4)]"
                                    initial={{ left: '0%', opacity: 0 }}
                                    animate={{ left: `${progress}%`, opacity: 1 }}
                                    transition={{ duration: 1.4, delay: 1.4, ease }}
                                />
                            </div>
                        </motion.div>

                        {/* Social links */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease, delay: 1.1 }}
                            className="flex gap-3 flex-wrap pt-1"
                        >
                            {social.github && (
                                <a
                                    href={social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-500/40 transition-all duration-200"
                                >
                                    <GithubIcon size={15} />
                                    GitHub
                                </a>
                            )}
                            {social.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-500/40 transition-all duration-200"
                                >
                                    <LinkedinIcon size={15} />
                                    LinkedIn
                                </a>
                            )}
                            <a
                                href="mailto:contato@rychard.dev"
                                aria-label="Contato"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                <ExternalLink size={15} />
                                Contato
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="flex flex-col items-center gap-1.5"
                >
                    <div className="w-px h-8 bg-gradient-to-b from-blue-500/40 to-transparent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                </motion.div>
            </div>
        </section>
    )
}
