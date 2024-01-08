import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler, MinMaxScaler

dist_df=pd.read_csv('dist_df.csv',index_col="Unnamed: 0")
item_vecs_with_index=pd.read_csv('item_vecs_with_index.csv')
movie_list=pd.read_csv('movie_list.csv',index_col="movieId")
sorted_index = np.argsort(dist_df.loc[6323])
sorted_items = item_vecs_with_index.loc[sorted_index]
indices=sorted_items["0"]
print(movie_list.loc[indices[1:]])