import { BrowserRouter as Router } from 'react-router';
import RouteConfig from './routes/RouteConfig';

const isProduction = process.env.NODE_ENV === 'production';
const basename = isProduction ? '/school-management-app' : '/';

function App() {
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
