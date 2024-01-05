exports.up = function(knex) {
    return knex.schema.createTable('movies_theaters', table => {
      table.increments('movies_theaters_id').primary(); // Primary key
      table.boolean('is_showing');
      table.integer('movie_id').unsigned().notNullable();
      table.integer('theater_id').unsigned().notNullable();
      table.foreign('movie_id').references('movie_id').inTable('movies');
      table.foreign('theater_id').references('theater_id').inTable('theaters');
      // Unique constraint to ensure a movie is not listed twice in the same theater
      table.unique(['movie_id', 'theater_id']);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('movies_theaters');
  };
  