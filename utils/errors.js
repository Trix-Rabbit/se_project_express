const ERROR_400_BAD_REQUEST = 400;
const ERROR_401_UNAUTHORIZED = 401;
const ERROR_403_FORBIDDEN = 403;
const ERROR_404_NOT_FOUND = 404;
const ERROR_409_DUPLICATE = 409;
const ERROR_500_DEFAULT_ERROR = 500;

const handleErrors = (req, res, err) => {
  if (err.name === "DocumentNotFoundError") {
    return res.status(ERROR_404_NOT_FOUND).send({ message: "No document found" });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(ERROR_400_BAD_REQUEST).send({ message: "Invalid Data" });
  }

  if (err.message === "Incorrect email or password") {
    return res.status(ERROR_401_UNAUTHORIZED).send({ message: "Email or Password not found" });
  }

  return res
    .status(ERROR_500_DEFAULT_ERROR)
    .send({ message: "An error has occurred on the server" });
};

module.exports = {
  ERROR_400_BAD_REQUEST,
  ERROR_401_UNAUTHORIZED,
  ERROR_403_FORBIDDEN,
  ERROR_404_NOT_FOUND,
  ERROR_409_DUPLICATE,
  ERROR_500_DEFAULT_ERROR,
  handleErrors,
};

