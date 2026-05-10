import { useEffect, useRef } from 'react'
import type { Skill } from '../types/portfolio'

const COLORS: Record<string, string> = {
	frontend: '#60a5fa',
	language: '#a78bfa',
	backend: '#34d399',
	database: '#fb923c',
	tools: '#94a3b8',
}

interface Node {
	x: number
	y: number
	vx: number
	vy: number
	homeX: number
	homeY: number
	phase: number
	name: string
	category: string
}

interface SkillNetworkCanvasProps {
	skills: Skill[]
}

export default function SkillNetworkCanvas({ skills }: SkillNetworkCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		if (!canvas || !ctx) return

		const nodes: Node[] = []
		const pointer = { x: -9999, y: -9999 }
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		let raf = 0
		let width = 0
		let height = 0
		let active = false

		const resize = () => {
			const rect = canvas.getBoundingClientRect()
			const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
			width = rect.width
			height = rect.height
			canvas.width = Math.max(1, Math.floor(width * dpr))
			canvas.height = Math.max(1, Math.floor(height * dpr))
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			layout()
			draw(performance.now())
		}

		const layout = () => {
			nodes.length = 0
			const cx = width / 2
			const cy = height / 2
			const radiusX = Math.min(width * 0.4, 280)
			const radiusY = Math.min(height * 0.32, 150)

			skills.forEach((skill, index) => {
				const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2
				const wave = Math.sin(index * 1.9) * 0.12 + 1
				const homeX = cx + Math.cos(angle) * radiusX * wave
				const homeY = cy + Math.sin(angle) * radiusY * wave

				nodes.push({
					x: homeX,
					y: homeY,
					vx: 0,
					vy: 0,
					homeX,
					homeY,
					phase: index * 0.8,
					name: skill.name,
					category: skill.category,
				})
			})
		}

		const update = (time: number) => {
			const seconds = time / 1000

			for (const node of nodes) {
				const driftX = Math.cos(seconds * 0.7 + node.phase) * 5
				const driftY = Math.sin(seconds * 0.6 + node.phase) * 4
				const targetX = node.homeX + driftX
				const targetY = node.homeY + driftY
				const dx = node.x - pointer.x
				const dy = node.y - pointer.y
				const dist = Math.hypot(dx, dy)
				let repelX = 0
				let repelY = 0

				if (dist < 110 && dist > 0.1) {
					const force = (1 - dist / 110) * 3.2
					repelX = (dx / dist) * force
					repelY = (dy / dist) * force
				}

				node.vx = (node.vx + (targetX - node.x) * 0.028 + repelX) * 0.86
				node.vy = (node.vy + (targetY - node.y) * 0.028 + repelY) * 0.86
				node.x += node.vx
				node.y += node.vy
			}
		}

		const draw = (time: number) => {
			ctx.clearRect(0, 0, width, height)
			const dark = true

			if (!reducedMotion) update(time)

			for (let i = 0; i < nodes.length; i += 1) {
				for (let j = i + 1; j < nodes.length; j += 1) {
					const a = nodes[i]
					const b = nodes[j]
					const distance = Math.hypot(a.x - b.x, a.y - b.y)
					if (distance > 145) continue

					const alpha = (1 - distance / 145) * (dark ? 0.22 : 0.16)
					ctx.beginPath()
					ctx.moveTo(a.x, a.y)
					ctx.lineTo(b.x, b.y)
					ctx.strokeStyle = `rgba(${dark ? '96,165,250' : '37,99,235'},${alpha})`
					ctx.lineWidth = 1
					ctx.stroke()
				}
			}

			for (const node of nodes) {
				const color = COLORS[node.category] ?? '#94a3b8'
				const hovered = Math.hypot(node.x - pointer.x, node.y - pointer.y) < 46
				const radius = hovered ? 7 : 5

				if (hovered) {
					const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 28)
					gradient.addColorStop(0, `${color}55`)
					gradient.addColorStop(1, 'transparent')
					ctx.fillStyle = gradient
					ctx.beginPath()
					ctx.arc(node.x, node.y, 28, 0, Math.PI * 2)
					ctx.fill()
				}

				ctx.beginPath()
				ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
				ctx.fillStyle = hovered ? color : `${color}cc`
				ctx.fill()

				ctx.font = `${hovered ? 600 : 500} ${hovered ? 13 : 11}px Barlow, system-ui, sans-serif`
				ctx.textAlign = 'center'
				ctx.fillStyle = dark
					? `rgba(226,232,240,${hovered ? 1 : 0.68})`
					: `rgba(15,23,42,${hovered ? 1 : 0.68})`
				ctx.fillText(node.name, node.x, node.y + radius + 15)
			}

			if (active && !reducedMotion) {
				raf = requestAnimationFrame(draw)
			}
		}

		const start = () => {
			if (active) return
			active = true
			raf = requestAnimationFrame(draw)
		}

		const stop = () => {
			active = false
			cancelAnimationFrame(raf)
		}

		const onPointerMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch') return
			const rect = canvas.getBoundingClientRect()
			pointer.x = event.clientX - rect.left
			pointer.y = event.clientY - rect.top
		}

		const onPointerLeave = () => {
			pointer.x = -9999
			pointer.y = -9999
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) start()
				else stop()
			},
			{ threshold: 0.1 },
		)

		const resizeObserver = new ResizeObserver(resize)

		resize()
		if (reducedMotion) draw(performance.now())
		canvas.addEventListener('pointermove', onPointerMove, { passive: true })
		canvas.addEventListener('pointerleave', onPointerLeave)
		observer.observe(canvas)
		resizeObserver.observe(canvas)

		return () => {
			stop()
			canvas.removeEventListener('pointermove', onPointerMove)
			canvas.removeEventListener('pointerleave', onPointerLeave)
			observer.disconnect()
			resizeObserver.disconnect()
		}
	}, [skills])

	return <canvas ref={canvasRef} className="block h-[380px] w-full md:h-[430px]" />
}
