const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

// lists all the reservations. If a number is provided it lists only reservations with that number.
async function list(req, res) {
  if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    return res.json({ data });
  }

  const data = await service.list(req.query.date);
  res.json({ data });
}

// Validator checks for data in the req.body

function hasData(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "Reservation lacks required data." });
  } else next();
}

//Validator checks for data.first_name in the req.body

const hasFirstName = (req, res, next) => {
  const { data: { first_name } = {} } = req.body;
  if (first_name) {
    return next();
  }
  return next({ status: 400, message: "a first_name is required" });
};

//Validator checks for data.last_name in the req.body

const hasLastName = (req, res, next) => {
  const { data: { last_name } = {} } = req.body;
  if (last_name) {
    return next();
  }
  return next({ status: 400, message: "a last_name is required" });
};

//Validator checks for data.mobile_number in the req.body
const hasMobileNumber = (req, res, next) => {
  const { data: { mobile_number } = {} } = req.body;
  if (mobile_number) {
    return next();
  }
  return next({ status: 400, message: "a mobile_number is required" });
};

// Validator checks for data.reservation_date in the req.body.

function hasReservationDateTime(req, res, next) {
  const { data = {} } = req.body;
  let temp_reservation_time =
    data["reservation_time"] && data["reservation_time"].replace(":", "");

  if (!timeFormat.test(data.reservation_time))
    return next({ status: 400, message: "reservation_time field is invalid" });
  if (!dateFormat.test(data.reservation_date))
    return next({ status: 400, message: "reservation_date field is invalid" });

  if (new Date(data["reservation_date"]).getDay() + 1 === 2) {
    next({
      status: 400,
      message: `The restaurant is closed on Tuesdays, please pick a day when we are open!`,
    });
  } else if (Date.parse(data["reservation_date"]) < Date.now()) {
    next({
      status: 400,
      message: `Reservation must be made for a date further in the future.`,
    });
  } else if (temp_reservation_time < 1030) {
    next({
      status: 400,
      message: "reservation_time cannot be before business hours!",
    });
  } else if (temp_reservation_time > 2130) {
    next({
      status: 400,
      message:
        "Reservation cannot be less than one hour before business closing!",
    });
  }
  next();
}

// Validator checks for data.people in the req.body

const hasPeople = (req, res, next) => {
  const { data: { people } = {} } = req.body;

  //verifies more than 0 people and that it is in fact a number.

  if (people && people > 0 && typeof people === "number") {
    return next();
  }
  return next({ status: 400, message: "people are required" });
};

// explicitly pulls validated data to fulfill a post request to the database.

async function create(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = req.body.data;

  //only allowed with reservations of a booked status (booked is the default status)

  if (status === "booked") {
    const result = await service.create({
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    });
    res.status(201);
    res.json({ data: result });
  }

  if (status === "seated") {
    return next({
      status: 400,
      message: "status incorrectly labled as seated",
    });
  }

  if (status === "finished") {
    return next({
      status: 400,
      message: "status incorrectly labled as finished",
    });
  }

  const result = await service.create({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  });
  res.status(201);
  res.json({ data: result });
}

// Validator scans the database for a reservation with a matching reservation_id

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} does not exist`,
  });
}

// returns a reservation from the database and sets the reservation as an accessible variable

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// explicitly pulls validated data to fulfill a put request to the database.

async function update(req, res) {
  const {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
  } = req.body.data;

  const data = await service.update(
    {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
    },
    res.locals.reservation.reservation_id
  );
  res.json({ data });
}

// Validator checks for a valid data.status in the req.body

const hasStatus = (req, res, next) => {
  const { data: { status } = {} } = req.body;

  if (
    status === "booked" ||
    status === "seated" ||
    status === "cancelled" ||
    status === "finished"
  ) {
    if (res.locals.reservation.status === "finished") {
      return next({
        status: 400,
        message: `The reservation has all ready finished`,
      });
    }
    return next();
  }
  return next({
    status: 400,
    message: `status ${status} is unacceptable or finished`,
  });
};

//changes the status of a specific reservation

async function updateStatus(req, res, next) {
  const { status } = req.body.data;

  const data = await service.update(
    {
      status,
    },
    res.locals.reservation.reservation_id
  );
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDateTime,
    hasPeople,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDateTime,
    hasPeople,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
