import "./ThemeToggle.css"

const ThemeToggle = ({ isDarkTheme, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkTheme ? "☀️" : "🌙"}
    </button>
  )
}

export default ThemeToggle

