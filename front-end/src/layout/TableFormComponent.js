import React from "react";

export default function FormComponent({
  submitHandler,
  changeHandler,
  formData,
  cancelHandler,
}) {
  //formats the page

  return (
    <form onSubmit={submitHandler} className="container">
      <fieldset>
        <h4 className="mt-3 mb-2">Add Your Table Here!</h4>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="table_name">Table Name</label>
            <input
              type="text"
              name="table_name"
              placeholder="Table name"
              required={true}
              value={formData.table_name}
              onChange={changeHandler}
              style={{ width: "100%" }}
            />
          </div>
          {/* <h4 className="mt-3 mb-2">Add Your Table Here!</h4>
        <div className="container">
          <div className="mb-2 form-group col">
            <lable htmlFor="table_name" className="mx-3">
              Table Name
            </lable>
            <input
              type="text"
              name="table_name"
              placeholder="Table name"
              required={true}
              value={formData.table_name}
              onChange={changeHandler}
              style={{ width: "60%" }}
            />
          </div> */}

          {/* <div className="mb-2 form-group col">
            <lable htmlFor="capacity">Capacity</lable>
            <input
              type="number"
              name="capacity"
              placeholder="Table capacity"
              required={true}
              min="1"
              value={formData.capacity}
              onChange={changeHandler}
              style={{ width: "60%" }}
            /> */}

          <div className="form-group col">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="Table capacity"
              required={true}
              value={formData.capacity}
              onChange={changeHandler}
              min="1"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="container px-0">
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
