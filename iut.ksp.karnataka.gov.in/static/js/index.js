import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    configureStore
} from '@reduxjs/toolkit';
import {
    Provider
} from 'react-redux';
import userReducer from './reducers/user';

import storage from 'redux-persist/lib/storage';

import {
    combineReducers
} from "redux";
import {
    persistReducer
} from 'redux-persist';
import thunk from 'redux-thunk';

import {
    PersistGate
} from 'redux-persist/integration/react';
import {
    persistStore
} from 'redux-persist';

import {
    BrowserRouter
} from 'react-router-dom';
import {
    ROOT_DIRECTORY
} from './config';

const reducers = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <
    Provider store = {
        store
    } >
    <
    PersistGate loading = {
        null
    }
    persistor = {
        persistor
    } >
    <
    BrowserRouter basename = {
        ROOT_DIRECTORY
    } >
    <
    App / >
    <
    /BrowserRouter> <
    /PersistGate> <
    /Provider>
);