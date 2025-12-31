import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FillSlam from './pages/FillSlam';
import ViewBook from './pages/ViewBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewBook />} />
        <Route path="/fill" element={<FillSlam />} />
      </Routes>
    </Router>
  );
}

export default App;