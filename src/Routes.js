import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
//import firebase from './firebase/firebase';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';
import {
  Dashboard as DashboardView,
  //ProductList as ProductListView,
  UserList as UserListView,
  //Typography as TypographyView,
  //Icons as IconsView,
  //Account as AccountView,
  Settings as SettingsView,
  //SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  FileUpload as FileUploadView,
  DailyReports as DailyReportsView,
  MonthlyReports as MonthlyReportsView,
} from './views';

//const Routes = () => {
function Routes(props) {

  //if (!firebase.getCurrentUser()) {
    /*alert('here');
    return (<RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/signin"
      />);*/
  //}

  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={FileUploadView}
        exact
        layout={MainLayout}
        path="/upload"
      />
      <RouteWithLayout
        component={DailyReportsView}
        exact
        layout={MainLayout}
        path="/analytics"
      />
      <RouteWithLayout
        component={MonthlyReportsView}
        exact
        layout={MainLayout}
        path="/reporting"
      />
      {/*<RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />*/}
      {/*<RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />*/}
      {/*<RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />*/}
      {/*<RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />*/}
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      {/*<RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />*/}
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/signin"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
