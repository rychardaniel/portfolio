import { GithubIcon, LinkedinIcon } from './icons'
import type { Social } from '../types/portfolio'

interface FooterProps {
	name: string
	social: Social
}

export default function Footer({ name, social }: FooterProps) {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t border-slate-800 bg-[#050505] py-8">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
				<p className="font-mono text-xs text-slate-500">
					&copy; {year} {name.toLowerCase()}
				</p>
				<div className="flex items-center gap-4">
					{social.github && (
						<a
							href={social.github}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="text-slate-500 transition-colors hover:text-blue-300"
						>
							<GithubIcon size={18} />
						</a>
					)}
					{social.linkedin && (
						<a
							href={social.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
							className="text-slate-500 transition-colors hover:text-blue-300"
						>
							<LinkedinIcon size={18} />
						</a>
					)}
				</div>
			</div>
		</footer>
	)
}
