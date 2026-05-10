import { useEffect, type DependencyList } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function useGsapScroll(
	setup: (context: {
		gsap: typeof gsap
		ScrollTrigger: typeof ScrollTrigger
		reducedMotion: boolean
	}) => void | (() => void),
	deps: DependencyList,
) {
	useEffect(() => {
		if (!registered) {
			gsap.registerPlugin(ScrollTrigger)
			registered = true
		}

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const cleanup = setup({ gsap, ScrollTrigger, reducedMotion })

		return () => {
			cleanup?.()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}
