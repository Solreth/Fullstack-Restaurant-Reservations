import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import DisplayReservations from "../layout/DisplayReservations";
import DisplayTables from "../layout/DisplayTables";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date, reservations, setReservations, tables, setTables }) {
  const dateQuery = useQuery().get("date");
  const [reservationsError, setReservationsError] = useState({});
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  const history = useHistory();

  useEffect(loadDashboard, [date, pageDate, setReservations, setTables]);

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError({});
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
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
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="box-title mb-0">Reservations for {pageDate}</h4>
          </div>
          <div
            className="btn-group"
            role="group"
            aria-label="navigation buttons"
          >
            <button onClick={previousHandler} className="btn btn-secondary">
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </button>
            <button className="btn btn-secondary">Today</button>
            <button onClick={nextHandler} className="btn btn-secondary">
              Next&nbsp;<span className="oi oi-chevron-right"></span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table no-wrap">
              <thead>
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">NAME</th>
                  <th className="border-top-0">PHONE</th>
                  <th className="border-top-0">DATE</th>
                  <th className="border-top-0">TIME</th>
                  <th className="border-top-0">PEOPLE</th>
                  <th className="border-top-0">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <DisplayReservations reservations={reservations} />
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="table-responsive">
            <table className="table no-wrap">
              <thead>
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">TABLE NAME</th>
                  <th className="border-top-0">CAPACITY</th>
                  <th className="border-top-0">FREE?</th>
                </tr>
              </thead>
              <tbody>
                <DisplayTables tables={tables} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {reservationsError.length && <ErrorAlert error={reservationsError} />}
    </main>
  );
}

export default Dashboard;
