// React Imports
import React, { FC, lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { Header, Popup } from "./Components/Custom";
import { Page } from "./Components/Loading";

// Redux Imports
import ReduxStore from "./Store";

// Material UI Imports
import Theme from "./Theme";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Page Imports
const Home = lazy(() => import("./Pages/Home"));
const Statistics = lazy(() => import("./Pages/Statistics"));
const Settings = lazy(() => import("./Pages/Settings"));

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 372,
    margin: "auto",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
}));

const App: FC = () => {
  const classes = useStyles();

  return (
    <ReduxStore>
      <Theme>
        <BrowserRouter>
          <SnackbarProvider>
            <Paper elevation={24} className={classes.container}>
              <Header />
              <Popup />
              <div className={classes.page}>
                <Routes />
              </div>
            </Paper>
          </SnackbarProvider>
        </BrowserRouter>
      </Theme>
    </ReduxStore>
  );
};

const Routes: FC = () => {
  return (
    <Suspense fallback={<Page />}>
      <Switch>
        <Route exact path="/popup.html/settings">
          <Settings />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route exact path="/popup.html/statistics">
          <Statistics />
        </Route>
        <Route exact path="/statistics">
          <Statistics />
        </Route>
        <Route exact path="/popup.html">
          <Home />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default App;
