
class ValidateParams {
  static evaluate(params) {
    params.toString().split('').forEach((element) => {
      if (isNaN(parseInt(element, 10))) { throw new Error("bad input"); }
    });
  }
}

export default ValidateParams;
