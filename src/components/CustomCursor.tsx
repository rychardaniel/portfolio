import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [active, setActive] = useState(false)
    const x = useMotionValue(-100)
    const y = useMotionValue(-100)
    const scale = useMotionValue(1)

    const rx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 })
    const ry = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 })
    const rs = useSpring(scale, { stiffness: 300, damping: 25 })

    useEffect(() => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        setActive(true)

        const onMove = (e: MouseEvent) => {
            x.set(e.clientX)
            y.set(e.clientY)
        }
        const onEnter = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button')) scale.set(2.4)
        }
        const onLeave = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button')) scale.set(1)
        }

        window.addEventListener('mousemove', onMove, { passive: true })
        document.addEventListener('mouseover', onEnter, { passive: true })
        document.addEventListener('mouseout', onLeave, { passive: true })
        return () => {
            window.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseover', onEnter)
            document.removeEventListener('mouseout', onLeave)
        }
    }, [x, y, scale])

    if (!active) return null

    return (
        <>
            {/* Ring — segue com spring (efeito lerp) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: rx,
                    y: ry,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: rs,
                    mixBlendMode: 'difference',
                }}
            >
                <div className="w-8 h-8 rounded-full border border-white opacity-75" />
            </motion.div>

            {/* Dot — segue o cursor exatamente */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x,
                    y,
                    translateX: '-50%',
                    translateY: '-50%',
                    mixBlendMode: 'difference',
                }}
            >
                <div className="w-[6px] h-[6px] rounded-full bg-white" />
            </motion.div>
        </>
    )
}
