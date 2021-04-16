import {lazy} from 'react';
import { RouteProps } from "react-router-dom";

interface IRouteProps extends RouteProps {
  requireAuth?: boolean;
}

const routes: IRouteProps[] = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../views/dashboard'))
  },
  {
    path: '/todoList/:date',
    exact: true,
    component: lazy(() => import('../views/todoList'))
  },
  {
    path: '/weeklyReport/:date',
    exact: true,
    component: lazy(() => import('../views/weeklyReport'))
  },
  {
    path: '/annualPlan',
    exact: true,
    component: lazy(() => import('../views/annualPlan'))
  },
  // {
  //   path: '*',
  //   component: NotFound,
  //   requiresAuth: false,
  // }
];

export default routes;
