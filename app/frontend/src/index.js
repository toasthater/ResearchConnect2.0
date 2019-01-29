import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import './styles/index.scss';
import { createStore , applyMiddleware } from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));


ReactDOM.render(<Root store={store} />, document.getElementById('root'));
// ReactDOM.render(
//     <BrowserRouter>
//     <Switch>
//      <Route path="/" component={App} />
//     </Switch>
//    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
