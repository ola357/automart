// eslint-disable-next-line no-unused-vars
const error = (err, req, res, next) => {
  res.status(500).send({
    status: 500,
    error: "server error",
  });
};
export default error;
