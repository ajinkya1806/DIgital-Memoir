import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreateBook from './pages/CreateBook';
import FillSlam from './pages/FillSlam';
import ViewBook from './pages/ViewBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/fill/:slug" element={<FillSlam />} />
        <Route path="/view/:slug" element={<ViewBook />} />
      </Routes>
    </Router>
  );
}

export default App;