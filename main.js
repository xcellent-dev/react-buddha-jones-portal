import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './core/store';
import router from './core/router';
import history from './core/history';

let routes = require('./routes.json');
const container = document.getElementById('root');

function renderComponent(component) {
  ReactDOM.render(<Provider store={store}>{component}</Provider>, container);
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

history.listen(render);
render(history.getCurrentLocation());

if (module.hot) {
    module.hot.accept('./routes.json', () => {
        routes = require('./routes.json'); // eslint-disable-line global-require
        render(history.getCurrentLocation());
    });
}
