import streamlit as st
import pandas as pd
import numpy as np
import pickle
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import sigmoid_kernel
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer

# Load pickled data
with open('popular_products.pkl', 'rb') as file:
    popular_products = pickle.load(file)

with open('women_popular.pkl', 'rb') as file:
    women_popular = pickle.load(file)

with open('men_popular.pkl', 'rb') as file:
    men_popular = pickle.load(file)

with open('pivot_matrix.pkl', 'rb') as file:
    pivot_matrix_index = pickle.load(file)

with open('filtered_indices.pkl', 'rb') as file:
    filtered_indices = pickle.load(file)

with open('sig.pkl', 'rb') as file:
    sig = pickle.load(file)

with open('indices.pkl', 'rb') as file:
    indices = pickle.load(file)

# Load the myntra dataset
myntra = pd.read_csv('myntra.csv')


# Function to recommend products based on content
def recommend_product(title, sig=sig):
    index = indices[title]
    sig_cs = list(enumerate(sig[index]))
    sig_cs = sorted(sig_cs, key=lambda x: x[1], reverse=True)
    sig_cs = sig_cs[1:11]
    product_indices = [i[0] for i in sig_cs]
    return myntra.iloc[product_indices]

# Inject CSS to make the screen pink
st.markdown(
    """
    <style>
    body {
        background-color: pink;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Streamlit application continues...
st.title("Choose Accordingly 😃")

option = st.selectbox('Choose the recommendation type:', ('Popularity-based', 'Content-based'))

if option == 'Popularity-based':
    gender = st.selectbox('Choose gender:', ('Men', 'Women'))
    if gender == 'Men':
        st.write("Popular products for Men:")
        for index, row in men_popular.iterrows():
            st.image(row['img1'], caption=row['title'])
            st.write(f"Brand: {row['brand']}")
            st.write(f"Price: {row.get('price', 'N/A')}")
            st.write("---")
    else:
        st.write("Popular products for Women:")
        for index, row in women_popular.iterrows():
            st.image(row['img1'], caption=row['title'])
            st.write(f"Brand: {row['brand']}")
            st.write(f"Price: {row.get('price', 'N/A')}")
            st.write("---")

elif option == 'Content-based':
    selected_product = st.selectbox('Choose a product:', myntra['title'].unique())
    st.write(f"Recommendations for {selected_product}:")
    recommendations = recommend_product(selected_product)
    for index, row in recommendations.iterrows():
        st.image(row['img1'], caption=row['title'])
        st.write(f"Brand: {row['brand']}")
        st.write(f"Price: {row.get('price', 'N/A')}")
        st.write("---")

if st.button('Show product images'):
    selected_product_index = myntra[myntra['title'] == selected_product].index[0]
    st.image(myntra.loc[selected_product_index, ['img1', 'img2', 'img3', 'img4']].values)
