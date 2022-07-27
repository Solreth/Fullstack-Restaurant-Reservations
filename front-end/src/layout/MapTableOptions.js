import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
export default function MapTableOptions() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();

    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const output = tables.map((table, index) => {
    return (
      <option key={index} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <>
      {output}
      {tablesError.message && <ErrorAlert error={tablesError} />}
    </>
  );
}
