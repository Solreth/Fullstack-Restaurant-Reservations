import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const dateQuery = useQuery().get("date");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState({});
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  const history = useHistory();

  useEffect(loadDashboard, [date, pageDate]);

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError({});
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function previousHandler() {
    const date = pageDate;
    const newDate = previous(date);
    setPageDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  function nextHandler() {
    const date = pageDate;
    const newDate = next(date);
    setPageDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={previousHandler} className="btn btn-secondary mx-2">
        Previous
      </button>
      <button className="btn btn-secondary mx-2">Today</button>
      <button onClick={nextHandler} className="btn btn-secondary mx-2">
        Next
      </button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      {reservationsError.length && <ErrorAlert error={reservationsError} />}
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
