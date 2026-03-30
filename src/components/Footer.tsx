import { GithubIcon, LinkedinIcon } from './icons'
import type { Social } from '../types/portfolio'

interface FooterProps {
    name: string
    social: Social
}

export default function Footer({ name, social }: FooterProps) {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    &copy; {year} {name}
                </p>
                <div className="flex items-center gap-4">
                    {social.github && (
                        <a
                            href={social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
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
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            <LinkedinIcon size={18} />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    )
}
