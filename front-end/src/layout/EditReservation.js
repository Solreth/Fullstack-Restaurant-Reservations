import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { editReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import FormComponent from "./FormComponent";
import { readReservation } from "../utils/api";

export default function EditReservation() {
  const { reservation_id } = useParams();

  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState(initialData);
  const [reservationError, setReservationError] = useState({});

  const history = useHistory();

  /* rerenders the page when altering reservationError or Reservation Id
   checks for and sets the reservation */

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

  /* parses the # of people from string to a number and then updates the reservation
 returning back to the dashboard at the reservations date*/

  async function submitHandler(event) {
    event.preventDefault();
    reservation.people = parseInt(reservation.people);
    const abortController = new AbortController();

    try {
      setReservationError({});
      await editReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
      return () => abortController.abort();
    } catch (error) {
      setReservationError(error);
    }
  }

  // changes the form data to match the name and value of the input field being used

  function changeHandler({ target }) {
    setReservation({ ...reservation, [target.name]: target.value });
  }

  // formats the page

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol
          className="breadcrumb"
          style={{ backgroundColor: "#1b3e23", borderRadius: "0 0 10px 10px" }}
        >
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Reservation
          </li>
        </ol>
      </nav>

      <div className="row container">
        <h1>Edit Reservation</h1>
      </div>
      <FormComponent
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        reservation={reservation}
      />
      {reservationError.message && <ErrorAlert error={reservationError} />}
    </>
  );
}
