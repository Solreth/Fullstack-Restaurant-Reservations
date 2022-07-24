import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import FormComponent from "./FormComponent";

export default function AddReservation() {
  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [reservationsError, setReservationsError] = useState({});

  const history = useHistory();

  async function submitHandler(event) {
    event.preventDefault();
    formData.people = parseInt(formData.people);
    const abortController = new AbortController();

    const bookedDate = new Date(formData.reservation_date);

    if (bookedDate.getDay() === 1) {
      return setReservationsError({
        message: "Sorry! We're closed on this day!",
      });
    }

    const currentDate = new Date();

    if (bookedDate > currentDate) {
      setReservationsError({});
      await createReservation(formData, abortController.signal).catch(
        setReservationsError
      );
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } else {
      setReservationsError({
        message:
          "Sorry! We don't have a time machine! Try booking a reservation in the future!",
      });
    }
  }

  function changeHandler({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Reservation
          </li>
        </ol>
      </nav>

      <div className="row container">
        <h1>Add Reservation</h1>
      </div>
      <FormComponent
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        formData={formData}
      />
      {reservationsError.message && <ErrorAlert error={reservationsError} />}
    </>
  );
}
