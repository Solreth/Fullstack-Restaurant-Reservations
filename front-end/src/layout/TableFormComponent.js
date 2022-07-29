import React from "react";

export default function FormComponent({
  submitHandler,
  changeHandler,
  table,
  formData,
  cancelHandler,
}) {
  return (
    <form onSubmit={submitHandler} className="container">
      <fieldset>
        <h4 className="mt-3 mb-2">Add Your Table Here!</h4>
        <lable htmlFor="table_name" className="mx-3">
          Table Name
        </lable>
        <div className="container">
          <div className="mb-2">
            <input
              type="text"
              name="table_name"
              placeholder="Table name"
              required={true}
              value={formData.table_name}
              onChange={changeHandler}
              style={{ width: "60%" }}
            />
          </div>
          <lable htmlFor="capacity">Capacity</lable>
          <div>
            <input
              type="number"
              name="capacity"
              placeholder="Table capacity"
              required={true}
              min="1"
              value={formData.capacity}
              onChange={changeHandler}
              style={{ width: "60%" }}
            />
          </div>
        </div>
        <div className="container mt-3">
          <button
            className="btn btn-secondary mr-2 cancel"
            onClick={cancelHandler}
          >
            <span className="oi oi-x"></span>&nbsp; Cancel
          </button>

          <button type="submit" className="btn btn-primary mr-2">
            <span className="oi oi-check"></span>
            &nbsp; Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}
