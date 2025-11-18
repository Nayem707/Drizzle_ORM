const { pgTable, serial, varchar, text } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
});

const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
});

module.exports = {
  users,
  posts,
};
