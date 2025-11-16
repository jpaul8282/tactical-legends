const functions = require("firebase-functions");
const { Liveblocks } = require("@liveblocks/node");

const liveblocks = new Liveblocks({
  secret: "sk_dev_PZ3AMRkebhWyihY3qmxvTrPj65go0nOoUb-PTXMOgtvhxB-1oFldyYvplMD0uVFD",
});

exports.auth = functions.https.onCall(async (data, context) => {
  // Get the current user from your database
  const user = __getUserFromDB__(data);

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds, // Optional
    },
    { userInfo: user.metadata },
  );

  return JSON.parse(body);
});
import { createClient } from "@liveblocks/client";
import firebase from "firebase";
import "firebase/functions";

firebase.initializeApp({
  /* Firebase config */
});

const auth = firebase.functions().httpsCallable("liveblocks-auth");

// Create a Liveblocks client
const client = createClient({
  authEndpoint: async (room) => (await auth({ room })).data,
});
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: "sk_dev_PZ3AMRkebhWyihY3qmxvTrPj65go0nOoUb-PTXMOgtvhxB-1oFldyYvplMD0uVFD",
});

const room = await liveblocks.createRoom("my-room-id", {
  defaultAccesses: ["room:read", "room:presence:write"],
  groupsAccesses: {
    "my-group-id": ["room:write"],
  },
  usersAccesses: {
    "my-user-id": ["room:write"],
  },
});
const self = room.getSelf(); // or useSelf() in React
console.log(self.id);
console.log(self.info);
