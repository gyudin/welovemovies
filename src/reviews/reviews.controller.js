const reviewsService = require('./reviews.service');

async function list(request, response, next) {
    try {
        const data = await reviewsService.list();
        response.json({ data });
    } catch (error) {
        next(error);
    }
}

async function read(request, response, next) {
    const { reviewId } = request.params;
    const review = await reviewsService.read(reviewId);
    if (review) {
        response.json({ data: review });
    } else {
        next({ status: 404, message: 'Review cannot be found.' });
    }
}

async function update(request, response, next) {
    const { reviewId } = request.params;
    const updatedReviewData = request.body.data; 

    const review = await reviewsService.read(reviewId);
    if (!review) {
        return next({ status: 404, message: 'Review cannot be found.' });
    }

    try {
        const updatedReview = await reviewsService.update(reviewId, updatedReviewData);
        updatedReview.updated_at = getCurrentTimestamp.toString();
        response.json({ data: updatedReview });
      } catch (error) {
        next(error);
      }
}

async function destroy(request, response, next) {
    const { reviewId } = request.params;
    const review = await reviewsService.read(reviewId);
    if (!review) {
        return next({ status: 404, message: 'Review cannot be found.' });
    }

    try {
        await reviewsService.delete(reviewId);
        response.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

function getCurrentTimestamp () {
    return Date.now()
  }

module.exports = {
    list,
    read,
    update,
    delete: destroy,
};
