import './App.css'

function App() {
  return (
    <div className="portfolio-page">
      <h1>Gabriel's Web Page</h1>
      
      <div className="animated-elements">
        {/* Flying Toasters */}
        <div className="toaster toaster-1">🍞</div>
        <div className="toaster toaster-2">🍞</div>
        <div className="toaster toaster-3">🍞</div>
        
        {/* Alarm Clocks */}
        <div className="clock clock-1">⏰</div>
        <div className="clock clock-2">⏰</div>
        <div className="clock clock-3">⏰</div>
        <div className="clock clock-4">⏰</div>
        
        {/* Worms */}
        <div className="worm worm-1">🐛</div>
        <div className="worm worm-2">🐛</div>
        <div className="worm worm-3">🐛</div>
        <div className="worm worm-4">🐛</div>
        
        {/* Lips */}
        <div className="lips lips-1">👄</div>
        <div className="lips lips-2">👄</div>
        
        {/* Bells */}
        <div className="bell bell-1">🔔</div>
        <div className="bell bell-2">🔔</div>
        
        {/* Character */}
        <div className="character">👤</div>
      </div>
      
      <div className="content">
        <p>Welcome to my portfolio!</p>
        <p>Check out my projects below:</p>
      </div>
    </div>
  )
}

export default App