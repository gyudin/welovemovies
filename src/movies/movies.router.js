const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsService = require('../reviews/reviews.service');
const theatersRouter = require("../theaters/theaters.router");

router.route("/")
  .get(controller.list)
  .all(methodNotAllowed);

router.route("/:movieId")
  .get(controller.read)
  .all(methodNotAllowed);

router.get('/:movieId/reviews', async (req, res, next) => {
try {
    const { movieId } = req.params;
    const reviews = await reviewsService.listReviewsForMovie(movieId);
    res.json({ data: reviews });
} catch (error) {
    next(error);
}
});

router.use("/:movieId/theaters", theatersRouter);

module.exports = router;
