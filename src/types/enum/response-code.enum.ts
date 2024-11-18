enum ResponseCode {
     // HTTP Status = 200
    SUCCESS = "SU" ,

     // HTTP Status = 400
    VALIDATION_FAILED = "VF" ,
    DUPLICATE_EMAIL = "DE" ,
    DUPLICATE_ID = "DI",
    DUPLICATE_NICKNAME = "DN" ,
    DUPLICATE_TEL_NUMBER = "DT" ,
    NOT_EXISTED_USER ="NU" ,
    NOT_EXISTED_BOARD ="NB" ,

     //HTTP Status = 401
    SIGN_IN_FAIL="SF" ,
    CERFITICATION_FAIL="CF",
    AUTHORIZATION = "AF" ,

     // HTTP Status = 403
    NO_PERMISSION = "NP" ,

     // HTTP Status = 500
    MAIL_FAIL = "MF",
    DATABASE_ERROR = "DBE" ,

}

export default ResponseCode;