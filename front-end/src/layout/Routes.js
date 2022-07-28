import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import AddReservation from "./AddReservation";
import AddTable from "./AddTable";
import AddSearch from "./AddSearch";
import { today } from "../utils/date-time";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard
          date={today()}
          reservations={reservations}
          setReservations={setReservations}
          tables={tables}
          setTables={setTables}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <AddReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <AddTable />
      </Route>
      <Route exact={true} path="/search">
        <AddSearch />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
