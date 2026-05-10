import { useEffect, useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
	theme: 'light' | 'dark'
	onToggleTheme: () => void
}

const navLinks = [
	{ label: 'Sobre', href: '#sobre' },
	{ label: 'Habilidades', href: '#habilidades' },
	{ label: 'Projetos', href: '#projetos' },
]

export default function Header({ theme, onToggleTheme }: HeaderProps) {
	const [scrolled, setScrolled] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 10)
		window.addEventListener('scroll', handler, { passive: true })
		return () => window.removeEventListener('scroll', handler)
	}, [])

	const handleNavClick = () => setMenuOpen(false)

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? 'border-b border-slate-800/80 bg-[#050505]/86 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md'
					: 'border-b border-transparent bg-[#050505]/45 backdrop-blur-sm'
			}`}
		>
			<nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<a
					href="#sobre"
					className="font-mono text-sm font-semibold tracking-[0.18em] text-slate-100 transition-colors hover:text-blue-300"
				>
					RS
				</a>

				<div className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-slate-100"
						>
							{link.label}
						</a>
					))}
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={onToggleTheme}
						aria-label="Alternar tema"
						className="rounded-lg border border-slate-800 p-2 text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-slate-50"
					>
						{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
					</button>

					<button
						onClick={() => setMenuOpen((o) => !o)}
						aria-label="Menu"
						className="rounded-lg border border-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-900 md:hidden"
					>
						{menuOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</nav>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
						className="overflow-hidden border-b border-slate-800/80 bg-[#050505]/96 backdrop-blur-md md:hidden"
					>
						<div className="px-6 py-4 flex flex-col gap-4">
							{navLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									onClick={handleNavClick}
									className="py-1 font-mono text-xs font-medium uppercase tracking-[0.16em] text-slate-400 transition-colors hover:text-blue-300"
								>
									{link.label}
								</a>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	)
}
