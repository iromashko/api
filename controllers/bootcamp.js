const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../model/bootcamp");

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  let reqQuery = { ...req.query };
  fieldsToRemove = ["sort", "select", "limit", "page"];
  fieldsToRemove.forEach(field => delete reqQuery[field]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const total = await Bootcamp.countDocuments();
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;

  query = query.skip(startIdx).limit(limit);

  let pagination = {};

  if (endIdx < total) {
    pagination = {
      page: page + 1,
      limit
    };
  }
  if (startIdx > 0) {
    pagination = {
      page: page - 1,
      limit
    };
  }

  const bootcamps = await query;

  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: "bootcamp deleted"
  });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;
  const radius = distance / 3693;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
