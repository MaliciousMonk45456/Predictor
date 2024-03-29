from werkzeug.exceptions import HTTPException

class InternalServerError(HTTPException):
    pass

class SchemaValidationError(HTTPException):
    pass

class UserAlreadyExistsError(HTTPException):
    pass

class UnauthorizedError(HTTPException):
    pass

class DatabaseError(HTTPException):
    pass

class MovieNotFoundError(HTTPException):
    pass

class EmailNotSentError(HTTPException):
    pass

class EmailNotVerifiedError(HTTPException):
    pass    

errors = {
    "InternalServerError": {
        "message": "Something went wrong",
        "status": 500
    },
     "SchemaValidationError": {
         "message": "Invalid Input Fields",
         "status": 400
     },
     "UserAlreadyExistsError": {
         "message": "User with given email already exists",
         "status": 400
     },
     "UnauthorizedError": {
         "message": "Invalid credentials",
         "status": 401
     },
    "DatabaseError": {
        "message": "Database Error",
        "status": 500
    },
    "MovieNotFoundError": {
        "message": "Movie not found",
        "status": 400
    },
    "EmailNotSentError": {
        "message": "Email not sent",
        "status": 400
    },
    "EmailNotVerifiedError": {
        "message": "Invalid email",
        "status": 400
    }
}
