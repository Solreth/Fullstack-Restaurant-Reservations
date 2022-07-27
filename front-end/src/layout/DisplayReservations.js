import React from "react";
import { Link } from "react-router-dom";

export default function DisplayReservations({ reservations }) {
  const output = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <td>
          <div name="reservation_id">{reservation.reservation_id}</div>
        </td>
        <td>
          <div name="reservation_name">
            {reservation.first_name}&nbsp;{reservation.last_name}
          </div>
        </td>
        <td>
          <div name="reservation_phone">{reservation.mobile_number}</div>
        </td>
        <td>
          <div name="reservation_date">
            <p>{reservation.reservation_date}</p>
          </div>
        </td>
        <td>
          <div name="reservation_time">
            <p>{reservation.reservation_time}</p>
          </div>
        </td>
        <td>
          <div name="reservation_time">{reservation.people}</div>
        </td>
        <td>
          <div name="reservation_time">{reservation.status}</div>
        </td>
        <td>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button name="Seat">Seat</button>
          </Link>
        </td>
      </tr>
    );
  });
  return output;
}
