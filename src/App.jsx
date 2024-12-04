import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import RouteConfig from './routes/RouteConfig';

const isProduction = process.env.NODE_ENV === 'production';
const basename = isProduction ? '/school-management-app' : '/';

function App() {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router
      basename={basename}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <RouteConfig />
    </Router>
  );
}

export default App;
