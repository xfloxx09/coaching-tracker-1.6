import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TeamView from './pages/TeamView';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-magenta p-4 text-white text-xl">Coaching Tracker</nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team/:id" element={<TeamView />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;