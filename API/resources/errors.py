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

errors = {
    "InternalServerError": {
        "message": "Something went wrong",
        "status": 500
    },
     "SchemaValidationError": {
         "message": "Invalid Request Fields",
         "status": 400
     },
     "UserAlreadyExistsError": {
         "message": "User with given email already exists",
         "status": 400
     },
     "UnauthorizedError": {
         "message": "Invalid username or password",
         "status": 401
     },
    "DatabaseError": {
        "message": "Database Error",
        "status": 500
    }
}
