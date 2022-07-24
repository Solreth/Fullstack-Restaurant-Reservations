import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { Link, useHistory } from "react-router-dom";
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

  const history = useHistory();

  async function submitHandler(event) {
    event.preventDefault();
    formData.people = parseInt(formData.people);
    await createReservation(formData);
    history.push(`/dashboard?date=${formData.reservation_date}`);
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
    </>
  );
}
