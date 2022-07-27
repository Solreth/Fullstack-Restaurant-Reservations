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
      <h4 className="mt-3 mb-2">First Name</h4>
      <input
        type="text"
        name="table_name"
        placeholder="Table name"
        required={true}
        value={formData.table_name}
        onChange={changeHandler}
      />
      <input
        type="number"
        name="capacity"
        placeholder="Table capacity"
        required={true}
        min="1"
        value={formData.capacity}
        onChange={changeHandler}
      />

      <button className="btn btn-secondary my-2" onClick={cancelHandler}>
        Cancel
      </button>

      <button type="submit" className="btn btn-primary mx-2">
        Submit
      </button>
    </form>
  );
}
