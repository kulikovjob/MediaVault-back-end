// TODO: Delete this rule in next time when this file gonna be updated
/* eslint-disable import/prefer-default-export */
export const getDatabaseConnectionUrl = () =>
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?`;
