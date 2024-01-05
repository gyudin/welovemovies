const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName)
    .where({ review_id: reviewId })
    .del();
}

async function list(movie_id) {
  return db(tableName)
    .select('*')
    .where({ movie_id })
    .then(reviews => Promise.all(reviews.map(setCritic)));
}

async function read(reviewId) {
  return db(tableName)
    .where({ review_id: reviewId })
    .first()
    .then(setCritic);
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  if (review && review.critic_id) {
    review.critic = await readCritic(review.critic_id);
  }
  return review;
}

async function update(reviewId, updatedReviewData) {
  if (!updatedReviewData || Object.keys(updatedReviewData).length === 0) {
    throw new Error("No valid data provided for update.");
  }
  return db(tableName)
    .where({ review_id: reviewId })
    .update(updatedReviewData)
    .then(() => read(reviewId));
}

async function listReviewsForMovie(movieId) {
  return db('reviews')
    .where({ movie_id: movieId })
    .join('critics', 'reviews.critic_id', 'critics.critic_id')
    .select(
      'reviews.*',
      'critics.preferred_name', 
      'critics.surname', 
      'critics.organization_name'
    )
    .then(reviews => reviews.map(review => {
      return {
        ...review,
        critic: {
          preferred_name: review.preferred_name,
          surname: review.surname,
          organization_name: review.organization_name
        }
      };
    }));
}

module.exports = {
  delete: destroy,
  list,
  read,
  update,
  listReviewsForMovie,
  readCritic
};
