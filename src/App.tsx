import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import HeroTerminal from './components/HeroTerminal'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import portfolioData from './data/portfolio.json'
import type { Portfolio } from './types/portfolio'

const data = portfolioData as Portfolio

export default function App() {
	const { theme, toggle } = useTheme()

	return (
		<div className="min-h-screen">
			<CustomCursor />
			<Header theme={theme} onToggleTheme={toggle} />
			<main>
				<HeroTerminal data={data} />
				<Skills skills={data.skills} />
				<Projects projects={data.projects} />
			</main>
			<Footer name={data.name} social={data.social} />
		</div>
	)
}
