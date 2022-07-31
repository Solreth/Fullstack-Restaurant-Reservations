import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation } from "../utils/api";
import MapTableOptions from "./MapTableOptions";
import { seatTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

export default function SeatReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState({});
  const [selectedTableId, setSelectedTableId] = useState(3);
  const history = useHistory();

  //rerenders the page on changes made to reservationError and reservation id
  // reads and sets a reservation to the use state
  useEffect(() => {
    const abortController = new AbortController();
    const checkReservation = async () => {
      try {
        await readReservation(reservation_id, abortController.signal).then(
          setReservation
        );
      } catch (error) {
        setReservationError(error);
      }
    };
    checkReservation();
    return () => abortController.abort;
  }, [reservationError, reservation_id]);

  // returns to the previous page

  function cancelHandler() {
    history.goBack();
  }

  // sets a table to seated and returns to the dashboard

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      setReservationError({});
      await seatTable(reservation_id, selectedTableId, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
      return () => abortController.abort();
    } catch (error) {
      setReservationError(error);
    }
  }

  //adjusts the state for the table ID to the option selected in the dropdown

  function changeHandler({ target }) {
    setSelectedTableId(Number(target.value));
  }

  //formats the page

  return (
    <>
      <h1>Seat Table</h1>
      <h3>
        {" "}
        #{reservation_id} - {reservation.first_name} {reservation.last_name} on{" "}
        {reservation.reservation_date} at {reservation.reservation_time} for{" "}
        {reservation.people}!
      </h3>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="table_id">Seat at:</label>
              <select
                id="table_id"
                name="table_id"
                className="form-control"
                required
                onClick={changeHandler}
              >
                <option value>Select a table</option>
                <MapTableOptions />
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelHandler}
            className="btn btn-secondary mr-2 cancel"
          >
            <span className="oi oi-x"></span>
            &nbsp;Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="oi oi-check"></span>
            &nbsp;Submit
          </button>
        </fieldset>
      </form>
      {reservationError.message && <ErrorAlert error={reservationError} />}
    </>
  );
}
