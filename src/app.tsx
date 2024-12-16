import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HostPortal from './components/HostPortal';
import ParticipantForm from './components/ParticipantForm';
import DataView from './components/DataView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header>
          <p>
            Welcome to Dembrane Test Portal.
          </p>
          <Routes>
            <Route path="/" element={<HostPortal />} />
            <Route path="/form/:formId" element={<ParticipantForm />} />
            <Route path="/responses/:formId" element={<DataView />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
