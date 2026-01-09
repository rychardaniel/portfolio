import { useEffect } from "react";
import Layout from "./components/Layout/Layout";
import Hero from "./components/Hero/Hero";
import TechStack from "./components/TechStack/TechStack";
import CaseStudies from "./components/CaseStudies/CaseStudies";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import config from "./data/config.json";

function App() {
    useEffect(() => {
        const { theme } = config;
        const root = document.documentElement;

        root.style.setProperty("--color-bg-primary", theme.primaryColor);
        root.style.setProperty("--color-bg-secondary", theme.secondaryColor);
        root.style.setProperty("--color-accent-green", theme.accentGreen);
        root.style.setProperty("--color-accent-blue", theme.accentBlue);
        root.style.setProperty("--color-accent-amber", theme.accentAmber);
        root.style.setProperty("--color-accent-red", theme.accentRed);

        document.title = `${config.profile.shortName} Portfolio`;
    }, []);

    return (
        <Layout>
            <Hero />
            <TechStack />
            <CaseStudies />
            <About />
            <Footer />
        </Layout>
    );
}

export default App;
