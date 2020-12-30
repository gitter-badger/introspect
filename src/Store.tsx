// React Imports
import React, { FC } from "react";
import { Page } from "./Components/Loading";

// Redux Imports
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";

// Firebase Imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./Utils/config";
import {
  getFirebase,
  actionTypes as rrfActionTypes,
  firebaseReducer,
  ReactReduxFirebaseProvider,
  FirebaseReducer,
  FirestoreReducer,
} from "react-redux-firebase";
import {
  getFirestore,
  constants as rfConstants,
  createFirestoreInstance,
  firestoreReducer,
} from "redux-firestore";

// Redux Persist Imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { PersistGate } from "redux-persist/lib/integration/react";
import storage from "redux-persist/lib/storage";

// Reducer Imports
import { homeReducer, HomeState, HomeData } from "./Redux/home.slice";
import { popupReducer, PopupState } from "./Redux/popup.slice";
import { settingsReducer, SettingsState } from "./Redux/settings.slice";

export interface StoreSchema {}

export type Responses = Record<string, HomeData>;

export interface Profile {
  responses: Responses;
  settings: {
    prefix: {
      description: string;
      reflection: string;
    };
  };
}

interface State {
  home: HomeState & PersistPartial;
  popup: PopupState;
  settings: SettingsState;
  firebase: FirebaseReducer.Reducer<Profile, StoreSchema>;
  firestore: FirestoreReducer.Reducer;
}

const rootPersistConfig = {
  version: 1,
  storage,
};

const reducers = combineReducers<State>({
  home: persistReducer<HomeState>(
    { ...rootPersistConfig, key: "home", blacklist: ["date"] },
    homeReducer
  ),
  popup: popupReducer,
  settings: settingsReducer,
  firebase: firebaseReducer,
  //@ts-expect-error firestoreReducer does not have correct typings
  firestore: firestoreReducer,
});

const persistedReducer = persistReducer<State>(
  { ...rootPersistConfig, key: "root", blacklist: ["home"] },
  reducers
);

const extraArgument = {
  getFirebase,
  getFirestore,
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        ...Object.keys(rfConstants.actionTypes).map(
          (type) => `${rfConstants.actionsPrefix}/${type}`
        ),
        ...Object.keys(rrfActionTypes).map(
          (type) => `@@reactReduxFirebase/${type}`
        ),
      ],
      ignoredPaths: ["firebase", "firestore"],
    },
    thunk: {
      extraArgument,
    },
  }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk = ThunkAction<
  void,
  RootState,
  typeof extraArgument,
  Action<string>
>;

export const getState = store.getState;

const persistor = persistStore(store);

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const ReduxStore: FC = ({ children }) => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider
        dispatch={store.dispatch}
        firebase={firebase}
        config={{
          logErrors: true,
          useFirestoreForProfile: true,
          userProfile: "users",
          updateProfileOnLogin: true,
          autoPopulateProfile: true,
        }}
        createFirestoreInstance={createFirestoreInstance}
      >
        <PersistGate loading={<Page />} persistor={persistor}>
          {children}
        </PersistGate>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default ReduxStore;
