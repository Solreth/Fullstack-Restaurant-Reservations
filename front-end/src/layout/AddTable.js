import React, { useState } from "react";
import { createTable } from "../utils/api";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import FormComponent from "./TableFormComponent";

export default function AddTable() {
  const initialData = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [tablesError, setTablesError] = useState({});

  const history = useHistory();

  // parses the string of capacity into a number and creates a new table, returning to dashboard

  async function submitHandler(event) {
    event.preventDefault();
    formData.capacity = parseInt(formData.capacity);
    const abortController = new AbortController();

    try {
      setTablesError({});
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
      return () => abortController.abort();
    } catch (error) {
      setTablesError(error);
    }
  }

  //returns to previous page

  function cancelHandler() {
    history.goBack();
  }

  // changes the form data to match the name and value of the input field being used

  function changeHandler({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
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
            Create Table
          </li>
        </ol>
      </nav>

      <div className="row container">
        <h1>Create Table</h1>
      </div>
      <FormComponent
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        cancelHandler={cancelHandler}
        formData={formData}
      />
      {tablesError.message && <ErrorAlert error={tablesError} />}
    </>
  );
}
