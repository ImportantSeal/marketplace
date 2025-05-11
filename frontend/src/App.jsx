import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "./shared/components/Navbar/Navbar";
import { AuthContextProvider } from "./shared/components/context/AuthContextProvider";
import { useAuthContext } from "./shared/components/context/auth-context";
import ErrorBoundary from "./ErrorBoundary";

import "./App.css";

const queryClient = new QueryClient();

const Items = lazy(() => import("./items/components/Items"));
const AddItem = lazy(() => import("./items/pages/AddItem"));
const MyItems = lazy(() => import("./items/pages/MyItems"));
const MyListings = lazy(() => import("./items/pages/MyListings"));
const ViewItem = lazy(() => import("./items/pages/ViewItem"));
const EditItem = lazy(() => import("./items/pages/EditItem"));
const Login = lazy(() => import("./users/pages/Login"));
const Signup = lazy(() => import("./users/pages/Signup"));
const Profile = lazy(() => import("./users/pages/Profile"));
const Users = lazy(() => import("./users/pages/Users"));

function AppContent() {
  const { isLoggedIn } = useAuthContext();

  return (
    <Router>
      <Navbar />
      <div className="content-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            {/* Koti */}
            <Route path="/" exact component={Items} />

            {/* Staattiset item-reitit ennen dynaamista */}
            <Route
              path="/items/new"
              exact
              render={() => (isLoggedIn ? <AddItem /> : <Redirect to="/login" />)}
            />
            <Route
              path="/items/my"
              exact
              render={() => (isLoggedIn ? <MyItems /> : <Redirect to="/login" />)}
            />

            {/* Dynaamiset item-reitit */}
            <Route path="/items/:id" exact component={ViewItem} />
            <Route
              path="/items/:id/edit"
              exact
              render={() => (isLoggedIn ? <EditItem /> : <Redirect to="/login" />)}
            />

            {/* Muut suojatut reitit */}
            <Route
              path="/my-listings"
              exact
              render={() => (isLoggedIn ? <MyListings /> : <Redirect to="/login" />)}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route
              path="/profile"
              exact
              render={() => (isLoggedIn ? <Profile /> : <Redirect to="/login" />)}
            />
            <Route
              path="/users"
              exact
              render={() => (isLoggedIn ? <Users /> : <Redirect to="/login" />)}
            />

            {/* Fallback */}
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
