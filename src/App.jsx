import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/generalContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Router>
          <Navbar />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
