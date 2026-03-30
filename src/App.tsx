import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'
import portfolioData from './data/portfolio.json'
import type { Portfolio } from './types/portfolio'

const data = portfolioData as Portfolio

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen">
      <Header theme={theme} onToggleTheme={toggle} />
      <main>
        <About data={data} />
        <Projects projects={data.projects} />
      </main>
      <Footer name={data.name} social={data.social} />
    </div>
  )
}
