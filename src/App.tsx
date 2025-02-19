import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Docs from './components/Docs';
import Editor from './components/Editor';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;