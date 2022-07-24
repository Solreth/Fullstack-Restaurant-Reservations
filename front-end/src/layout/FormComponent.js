import React from "react";
import { Link } from "react-router-dom";

export default function FormComponent({
  submitHandler,
  changeHandler,
  reservation,
  formData,
}) {
  return (
    <form onSubmit={submitHandler} className="container">
      <h4 className="mt-3 mb-2">First Name</h4>
      <input
        type="text"
        name="first_name"
        placeholder="First name"
        required={true}
        value={formData.first_name}
        onChange={changeHandler}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last name"
        required={true}
        value={formData.last_name}
        onChange={changeHandler}
      />
      <input
        type="text"
        name="mobile_number"
        placeholder="Mobile #"
        required={true}
        value={formData.mobile_number}
        onChange={changeHandler}
      />
      <input
        type="date"
        pattern="\d{4}-\d{2}-\d{2}"
        name="reservation_date"
        placeholder="YYYY-MM-DD"
        required={true}
        value={formData.reservation_date}
        onChange={changeHandler}
      />
      <input
        type="time"
        pattern="[0-9]{2}:[0-9]{2}"
        name="reservation_time"
        placeholder="HH:MM"
        required={true}
        value={formData.reservation_time}
        onChange={changeHandler}
      />
      <input
        type="number"
        name="people"
        placeholder="Party Size"
        required={true}
        value={formData.people}
        onChange={changeHandler}
      />

      <Link to={`/dashboard`}>
        <button className="btn btn-secondary my-2">Cancel</button>
      </Link>
      <button type="submit" className="btn btn-primary mx-2">
        Submit
      </button>
    </form>
  );
}
