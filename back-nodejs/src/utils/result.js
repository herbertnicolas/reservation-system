class Result {
    constructor({ msg, data, code }) {
      this.msg = msg;
      this.data = data;
      this.code = code;
    }
  
    handle(res) {
      res.status(this.code).json({
        message: this.msg,
        data: this.data,
      });
    }
  }
  
  class SuccessResult extends Result {
    constructor({ msg, data }) {
      super({ msg, data, code: 200 });
    }
  }
  
  class FailureResult extends Result {
    constructor({ msg, code }) {
      super({ msg, data: null, code });
    }
  }
  
  module.exports = {
    SuccessResult,
    FailureResult,
  };