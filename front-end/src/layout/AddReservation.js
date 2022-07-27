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

    try {
      setReservationsError({});
      await createReservation(formData, abortController.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setReservationsError(error);
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
