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

  async function submitHandler(event) {
    event.preventDefault();
    formData.capacity = parseInt(formData.capacity);
    const abortController = new AbortController();

    try {
      setTablesError({});
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setTablesError(error);
    }
  }

  function cancelHandler() {
    history.goBack();
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
