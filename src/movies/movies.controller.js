const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);

  if (movie) {
    response.locals.movie = movie;
    return next();
  }

  next({ status: 404, message: `Movie cannot be found.` });
}

async function read(request, response) {
  const { movie } = response.locals;
  response.json({ data: movie });
}

async function list(request, response) {
  const { is_showing } = request.query;
  const movies = await service.list(Boolean(is_showing));
  response.json({ data: movies });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
