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
        <div className="app-container">
          <Routes>
            <Route path="/" element={
              <div className="page-container">
                <Welcome />
              </div>
            } />
            <Route path="/docs" element={
              <div className="page-container">
                <Docs />
              </div>
            } />
            <Route path="/editor" element={
              <div className="page-container">
                <Editor />
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;