import renderRoutes from './router/react-router-config';
import routes from './router/routes';

function App() {
  return (
    <div className="App">
      {renderRoutes(routes)}
    </div>
  );
}

export default App;
