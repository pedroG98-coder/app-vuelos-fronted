import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import VuelosPage from './VuelosPage';
import ApiQuestionsPage from './ApiQuestionsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink exact to="/vuelos" activeClassName="active-link">Vuelos</NavLink>
            </li>
            <li>
              <NavLink exact to="/api-questions" activeClassName="active-link">API Questions</NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/vuelos">
            <VuelosPage />
          </Route>
          <Route exact path="/api-questions">
            <ApiQuestionsPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
