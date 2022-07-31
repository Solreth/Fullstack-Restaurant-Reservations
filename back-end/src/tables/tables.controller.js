const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// lists all the tables.

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

// pulls a pre-assigned table from the data to fulfill a post request to the database.

async function create(req, res, next) {
  const result = await service.create(req.body.data);
  res.status(201);
  res.json({ data: result });
}

// Validator checks for data in the req.body

function hasData(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "Table lacks required data." });
  } else next();
}

//Validator checks for data.table_name in the req.body

const hasTableName = (req, res, next) => {
  const { data: { table_name } = {} } = req.body;
  if (table_name && table_name.length > 1) {
    return next();
  }
  return next({ status: 400, message: "a table_name is required" });
};

//Validator checks for data.capacity in the req.body

const hasCapacity = (req, res, next) => {
  const { data: { capacity } = {} } = req.body;

  //verifies the capacity is a number

  if (capacity && typeof capacity === "number") {
    return next();
  }
  return next({ status: 400, message: "a valid capacity is required" });
};

async function update(req, res) {
  const data = await service.update(
    res.locals.table.table_id,
    res.locals.reservation.reservation_id
  );
  res.json({ data });
}

/* pulls from the paramaters a table ID and checks its existence
 if it exists, we submit the table to an accessible local variable
 and proceed */

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} cannot be found.`,
  });
}

/* pulls from the body data a reservation ID and checks its existence
 if a reservation ID is found,we check if the reservation exists, we 
 submit the table to an accessible local variable and proceed */

async function reservationExists(req, res, next) {
  const { data: { reservation_id } = {} } = req.body;
  if (reservation_id) {
    const reservation = await service.readReservation(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    return next({
      status: 404,
      message: `reservation ${reservation_id}} does not exist`,
    });
  } else {
    return next({
      status: 400,
      message: `reservation_id does not exist`,
    });
  }
}

//Validator checks for that a reservation id hasn't been assigned to the requested table

const hasAvailability = (req, res, next) => {
  if (res.locals.table.reservation_id !== null) {
    return next({ status: 400, message: "table is occupied" });
  }

  if (res.locals.reservation.status === "seated") {
    return next({ status: 400, message: "reservation is all ready seated" });
  }

  if (res.locals.table.capacity >= res.locals.reservation.people) {
    return next();
  }
  return next({ status: 400, message: "a valid capacity is required" });
};

/* returns a deleted table, destroying the table of the 
reservation_id in the process*/

async function destroy(req, res, next) {
  if (res.locals.table.reservation_id) {
    const clearedTables = await service.destroy(res.locals.table);
    res.json({ data: clearedTables });
  } else next({ status: 400, message: "table is not occupied" });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, hasTableName, hasCapacity, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(tableExists),
    hasData,
    reservationExists,
    hasAvailability,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
