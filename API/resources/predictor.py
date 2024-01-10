from flask import request
from flask_restful import Resource
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from flask_jwt_extended import jwt_required


def sq_dist(a,b):
    d=(np.linalg.norm(a-b))**2
    return d

def response(results_final):
    ans=[]
    for i in list(results_final.index):
        ans.append({"movieId":i,"Information":{"title":results_final.loc[i]["title"],"genres":results_final.loc[i]["genres"]}})
    # print(ans)
    return ans

class new_userAPI(Resource):
    @jwt_required()
    def post(self): 
        limit = request.args.get('limit', default = 10)
        json_ = request.json
        user_vec = np.array([list(json_.values())])
        item_vecs_with_index=pd.read_csv('./files/item_vecs_with_index.csv')
        num_items=item_vecs_with_index.shape[0]
        scalerUser=joblib.load('./files/users/scalerUser.pkl')
        suser_vecs = scalerUser.transform(user_vec)
        model_u=load_model('./files/users/model_u.h5')
        vu = model_u.predict(suser_vecs)
        vms=np.load('./files/vms.npy')
        y_p=np.matmul(vu,vms.T)
        scalerTarget=joblib.load('./files/users/scalerTarget.pkl')
        y_pu = scalerTarget.inverse_transform(y_p)
        sorted_index = np.argsort(-y_pu.reshape(-1))
        sorted_items = item_vecs_with_index.loc[sorted_index]
        movie_list=pd.read_csv('./files/movie_list.csv',index_col="movieId")
        results=movie_list.loc[sorted_items["0"]]
        results_final=results.head(int(limit))
        # print(results)
        ans=response(results_final)
        return ans,200 

class new_movies(Resource):
    @jwt_required()
    def post(self): 
        limit = request.args.get('limit', default = 15)
        json_ = request.json
        new_item_vec=np.array([list(json_.values())])
        item_vecs_with_index=pd.read_csv('./files/item_vecs_with_index.csv')
        movie_list=pd.read_csv('./files/movie_list.csv',index_col="movieId")
        scalerItem=joblib.load('./files/movies/scalerItem.pkl')
        scaled_new_item_vec = scalerItem.transform(new_item_vec)
        model_m=load_model('./files/movies/model_m.h5')
        new_item_vm = model_m.predict(scaled_new_item_vec)
        vms=np.load('./files/vms.npy')
        dist_new_item=np.zeros(vms.shape[0])
        for i in range(vms.shape[0]):
            dist_new_item[i] = sq_dist(vms[i, :], new_item_vm)
        sorted_index = np.argsort(dist_new_item)
        sorted_items = item_vecs_with_index.loc[sorted_index]
        results=movie_list.loc[sorted_items["0"]]
        results_final=results.head(int(limit))
        # print(results_final)
        ans=response(results_final)
        return ans,200
    
class existing_movie(Resource):
    @jwt_required()
    def get(self,movieid):    
        movies=pd.read_csv('./files/movie_list.csv',index_col="movieId")
        item_vecs=pd.read_csv('./files/item_vecs_with_index.csv',index_col="0")
        # print(item_vecs.loc[int(movieid)])
    
        if int(movieid) in movies.index:
            genre={"action":0,"adventure":0,"animation":0,"childrens":0,"comedy":0,"crime":0,"documentary":0,"drama":0,"fantasy":0,"horror":0,"mystery":0,"romance":0,"scifi":0,"thriller":0}
        for i in list(movies.loc[int(movieid)]["genres"].split("|")):
            genre[i.lower()]=1
            title=movies.loc[int(movieid)]["title"]
            average_rating=item_vecs.loc[int(movieid)]["2"]
            year=title[-5:-1]
            datasetID=int(movieid)
            result={
                "title":title,
                "genre":genre,
                "average_rating":average_rating,
                "datasetID":datasetID,
                "year":year
            }
            return result,200
        else:
            return ({"message":"Movie not found"}),400
     
class existing_movie2(Resource):
    @jwt_required()
    def get(self,movieid):
        limit = request.args.get('limit', default = 15)
        movies=pd.read_csv('./files/movie_list.csv',index_col="movieId")
        if int(movieid) not in movies.index:    
            return ({"message":"Movie not found"}),400
        dist_df=pd.read_csv('./files/movies/dist_df.csv',index_col="Unnamed: 0")
        item_vecs_with_index=pd.read_csv('./files/item_vecs_with_index.csv')
        movie_list=pd.read_csv('./files/movie_list.csv',index_col="movieId")
        sorted_index = np.argsort(dist_df.loc[int(movieid)])
        sorted_items = item_vecs_with_index.loc[sorted_index]
        indices=sorted_items["0"]
        results=movie_list.loc[indices[1:]]
        results_final=results.head(int(limit))
        # print(results)
        ans=response(results_final)
        return ans,200 
