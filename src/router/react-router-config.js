import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Loading from '../components/loading';

const renderRoutes = (routes, extraProps = {}, switchProps = {}) =>
  routes ? (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch {...switchProps}>
          {routes.map((route, i) => ( 
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              render={props => {
                if (!route.requireAuth) {
                  return <route.component {...props} {...extraProps} route={route} />
                }
                return <Redirect to={{ pathname: 'Login', state: { from: props.location } }} />
              }}
            />
          ))}
        </Switch>
      </Suspense>
    </Router>
  ) : null;
 export default renderRoutes;
 