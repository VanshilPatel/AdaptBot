import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import CardSection from "./components/CardSection"
import ThemeToggle from "./components/ThemeToggle"
import "./global.css"

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    document.body.classList.toggle("dark-theme")
  }

  return (
    <main className={isDarkTheme ? "dark-theme" : ""}>
      <Navbar />
      <Hero />
      <CardSection />
      <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
    </main>
  )
}

