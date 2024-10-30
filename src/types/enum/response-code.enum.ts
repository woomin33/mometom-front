enum ResponseCode{
    // HTTP Status 200
    SUCCESS = "SU",
    // 400
    VALIDATION_FAILED = "VF",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TEL_NUMBER = "DT",
    NOT_EXISTED_BOARD = "NB",
    NOT_EXISTED_CORPORATION = "NC",
    NOT_EXISTED_USER = "NU",

    // 401
    SIGN_IN_FAIL = "SF",
    AUTHORIZATION = "AF",

    // 403
    NO_PERMISSION = "NP",

    //500
    DATABASE_ERROR = "DBE"
}

export default ResponseCode;