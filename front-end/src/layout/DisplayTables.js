export default function DisplayTables({ tables }) {
  const output = tables.map((table, index) => {
    return (
      <tr key={index}>
        <td>
          <div name="table_id">{table.table_id}</div>
        </td>
        <td>
          <div name="table_name">{table.table_name}</div>
        </td>
        <td>
          <div name="capacity">{table.capacity}</div>
        </td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id === null ? "Free" : "Occupied"}
        </td>
      </tr>
    );
  });
  return output;
}
