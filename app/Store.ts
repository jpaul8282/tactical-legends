"use client";

import { createClient } from "@liveblocks/client";
import { liveblocksEnhancer } from "@liveblocks/redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const client = createClient({
  publicApiKey: "pk_prod_xxxxxxxxxxxxxxxxxxxxxxxx",
});

const initialState = {};

const slice = createSlice({
  name: "state",
  initialState,
  reducers: {
    /* logic will be added here */
  },
});

function makeStore() {
  return configureStore({
    reducer: slice.reducer,
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(liveblocksEnhancer({ client })),
  });
}

const store = makeStore();

export default store;

App.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "@liveblocks/redux";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.enterRoom("room-id"));

    return () => {
      dispatch(actions.leaveRoom("room-id"));
    };
  }, [dispatch]);

  return <Room />;
}
Room.tsx
"use client";

import { useSelector } from "react-redux";

export function Room() {
  const others = useSelector((state) => state.liveblocks.others);
  const userCount = others.length;
  return <div>There are {userCount} other user(s) online</div>;
}
