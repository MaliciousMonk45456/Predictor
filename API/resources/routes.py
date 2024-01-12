from .auth import LoginApi, RegisterApi,DeleteApi
from .predictor import new_userAPI,new_movies,existing_movie,existing_movie2

def initialize_routes(api):
    api.add_resource(LoginApi, '/login')
    api.add_resource(RegisterApi, '/register')
    api.add_resource(DeleteApi, '/delete')

    api.add_resource(new_userAPI, '/user')
    api.add_resource(new_movies, '/movie')
    api.add_resource(existing_movie, '/movie/<movieid>')
    api.add_resource(existing_movie2, '/movie/existing/<movieid>')
