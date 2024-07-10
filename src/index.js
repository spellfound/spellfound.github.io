import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import './index.css';
import Spellfound from './Spellfound';
import * as serviceWorker from './serviceWorker';

function Puzzle() {
  let { puzzle } = useParams();
  return <Spellfound puzzle={puzzle}/>;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/">
          <Spellfound/>
        </Route>
        <Route path="/puzzles/:puzzle">
          <Puzzle/>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
