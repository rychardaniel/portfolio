import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Skill } from '../types/portfolio'

/* ── Paleta por categoria ──────────────────────────────────────────────────── */

const COLORS: Record<string, string> = {
    frontend: '#60a5fa', // blue-400
    language: '#a78bfa', // violet-400
    backend: '#34d399',  // emerald-400
    database: '#fb923c', // orange-400
    tools: '#94a3b8',    // slate-400
}

const LABELS: Record<string, string> = {
    frontend: 'Frontend',
    language: 'Linguagem',
    backend: 'Backend',
    database: 'Banco de Dados',
    tools: 'Ferramentas',
}

/* ── Tipos internos ────────────────────────────────────────────────────────── */

interface Node {
    x: number
    y: number
    vx: number
    vy: number
    homeX: number
    homeY: number
    name: string
    category: string
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface SkillsProps {
    skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let raf = 0
        let w = 0
        let h = 0
        const nodes: Node[] = []
        const mouse = { x: -9999, y: -9999 }

        /* ── Setup ──────────────────────────────────────────────────────── */
        const setup = () => {
            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()
            w = rect.width
            h = rect.height
            canvas.width = w * dpr
            canvas.height = h * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            initNodes()
        }

        const initNodes = () => {
            nodes.length = 0
            const cx = w / 2
            const cy = h / 2
            /*
             * Distribui os nós em elipse. Para cada nó i de N total:
             *   ângulo = (i/N) * 2π − π/2  (começa no topo)
             *   raio varia ±15% para deixar mais orgânico
             */
            const n = skills.length
            const rx = Math.min(w, h) * 0.36
            const ry = Math.min(w, h) * 0.28

            skills.forEach((skill, i) => {
                const angle = (i / n) * Math.PI * 2 - Math.PI / 2
                const jitter = 1 + (Math.random() - 0.5) * 0.3
                const hx = cx + Math.cos(angle) * rx * jitter
                const hy = cy + Math.sin(angle) * ry * jitter
                nodes.push({
                    x: hx + (Math.random() - 0.5) * 20,
                    y: hy + (Math.random() - 0.5) * 20,
                    vx: 0,
                    vy: 0,
                    homeX: hx,
                    homeY: hy,
                    name: skill.name,
                    category: skill.category,
                })
            })
        }

        /* ── Física ─────────────────────────────────────────────────────── */
        /*
         * Cada frame aplica três forças a cada nó:
         *   1. Mola (spring): puxa o nó em direção ao homeX/homeY
         *      F_spring = (home − pos) * k_spring
         *   2. Ruído (drift): pequena perturbação aleatória para o nó flutuar
         *   3. Repulsão do mouse: força que afasta o nó quando o cursor se aproxima
         *      F_repulse = (1 − dist/R) * strength, na direção (nó − mouse)
         * Após somar as forças, aplica amortecimento: v *= damping
         */
        const K_SPRING = 0.022
        const DAMPING = 0.88
        const DRIFT = 0.12
        const REPULSE_R = 90
        const REPULSE_S = 2.2
        const CONNECT_R = 130

        const update = () => {
            for (const nd of nodes) {
                const ax = (nd.homeX - nd.x) * K_SPRING
                const ay = (nd.homeY - nd.y) * K_SPRING

                const dx = (Math.random() - 0.5) * DRIFT
                const dy = (Math.random() - 0.5) * DRIFT

                const mdx = nd.x - mouse.x
                const mdy = nd.y - mouse.y
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
                let rx = 0
                let ry = 0
                if (mdist < REPULSE_R && mdist > 0.5) {
                    const f = (1 - mdist / REPULSE_R) * REPULSE_S
                    rx = (mdx / mdist) * f
                    ry = (mdy / mdist) * f
                }

                nd.vx = (nd.vx + ax + dx + rx) * DAMPING
                nd.vy = (nd.vy + ay + dy + ry) * DAMPING
                nd.x += nd.vx
                nd.y += nd.vy
            }
        }

        /* ── Render ─────────────────────────────────────────────────────── */
        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            const dark = document.documentElement.classList.contains('dark')

            update()

            /* Conexões: linha entre pares de nós dentro do raio CONNECT_R */
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i]
                    const b = nodes[j]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist > CONNECT_R) continue

                    /*
                     * Alpha proporcional à proximidade:
                     * α = (1 − dist/R) mapeado para [0, maxAlpha]
                     */
                    const alpha = (1 - dist / CONNECT_R) * (dark ? 0.22 : 0.12)
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.strokeStyle = dark
                        ? `rgba(96, 165, 250, ${alpha})`
                        : `rgba(37, 99, 235, ${alpha})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }

            /* Nós */
            for (const nd of nodes) {
                const color = COLORS[nd.category] ?? '#94a3b8'
                const mdx = nd.x - mouse.x
                const mdy = nd.y - mouse.y
                const hovered = Math.sqrt(mdx * mdx + mdy * mdy) < 48
                const r = hovered ? 7 : 5

                /* Halo ao hover */
                if (hovered) {
                    const g = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, r * 4)
                    g.addColorStop(0, color + '50')
                    g.addColorStop(1, 'transparent')
                    ctx.beginPath()
                    ctx.arc(nd.x, nd.y, r * 4, 0, Math.PI * 2)
                    ctx.fillStyle = g
                    ctx.fill()
                }

                /* Círculo */
                ctx.beginPath()
                ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2)
                ctx.fillStyle = hovered ? color : color + 'cc'
                ctx.fill()

                /* Label */
                const fs = hovered ? 13 : 11
                ctx.font = `${hovered ? 600 : 400} ${fs}px Barlow, system-ui, sans-serif`
                ctx.textAlign = 'center'
                ctx.fillStyle = dark
                    ? `rgba(226,232,240,${hovered ? 1 : 0.65})`
                    : `rgba(30,41,59,${hovered ? 1 : 0.6})`
                ctx.fillText(nd.name, nd.x, nd.y + r + 14)
            }

            raf = requestAnimationFrame(draw)
        }

        /* ── Eventos ────────────────────────────────────────────────────── */
        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
        const onMouseLeave = () => {
            mouse.x = -9999
            mouse.y = -9999
        }

        setup()
        raf = requestAnimationFrame(draw)
        canvas.addEventListener('mousemove', onMouseMove, { passive: true })
        canvas.addEventListener('mouseleave', onMouseLeave)

        const ro = new ResizeObserver(setup)
        ro.observe(canvas)

        return () => {
            cancelAnimationFrame(raf)
            canvas.removeEventListener('mousemove', onMouseMove)
            canvas.removeEventListener('mouseleave', onMouseLeave)
            ro.disconnect()
        }
    }, [skills])

    const categories = Array.from(new Set(skills.map((s) => s.category)))

    return (
        <section id="habilidades" className="bg-white dark:bg-slate-950 py-24 relative">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        <p className="text-xs font-mono font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                            /habilidades
                        </p>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
                        Tecnologias
                    </h2>
                    <p className="mt-2 text-xs font-mono text-slate-400 dark:text-slate-500">
                        // mova o cursor para interagir com os nós
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
                    className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/60 dark:bg-slate-900/50"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full block"
                        style={{ height: 380 }}
                    />

                    {/* Legenda */}
                    <div className="absolute bottom-4 right-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-end">
                        {categories.map((cat) => (
                            <div key={cat} className="flex items-center gap-1.5">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: COLORS[cat] }}
                                />
                                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                    {LABELS[cat] ?? cat}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
