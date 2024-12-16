import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HostPortal from './components/hostPortal';
import ParticipantForm from './components/participantForm';
import DataView from './components/dataView';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>Simple Portal</h1>
        <Switch>
          <Route path="/" component={HostPortal} />
          <Route path="/form/:formId" component={ParticipantForm} />
          <Route path="/responses/:formId" component={DataView} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
