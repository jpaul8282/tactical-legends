import { createClient } from "@liveblocks/client";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",

  // Other options
  // ...
});

import { createClient } from "@liveblocks/client";

const client = createClient({
  // Connect with authEndpoint
  authEndpoint: "/api/liveblocks-auth",

  // Alternatively, use an authEndpoint callback
  // authEndpoint: async (room) => {
  //   const response = await fetch("/api/liveblocks-auth", {
  //   method: "POST",
  //   headers: {
  //     Authentication: "<your own headers here>",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ room }),
  // });
  // return await response.json();
  // },

  // Alternatively, use a public key
  // publicApiKey: "pk_...",

  // Throttle time (ms) between WebSocket updates
  throttle: 100,

  // Prevent browser tab from closing while local changes aren’t synchronized yet
  preventUnsavedChanges: false,

  // Throw lost-connection event after 5 seconds offline
  lostConnectionTimeout: 5000,

  // Disconnect users after X (ms) of inactivity, disabled by default
  backgroundKeepAliveTimeout: undefined,

  // Resolve user info for Comments and Notifications
  resolveUsers: async ({ userIds }) => {
    const usersData = await __getUsersFromDB__(userIds);

    return usersData.map((userData) => ({
      name: userData.name,
      avatar: userData.avatar.src,
    }));
  },

  // Resolve room info for Notifications
  resolveRoomsInfo: async ({ roomIds }) => {
    const documentsData = await __getDocumentsFromDB__(roomIds);

    return documentsData.map((documentData) => ({
      name: documentData.name,
      // url: documentData.url,
    }));
  },

  // Resolve mention suggestions for Comments
  resolveMentionSuggestions: async ({ text, roomId }) => {
    const workspaceUsers = await __getWorkspaceUsersFromDB__(roomId);

    if (!text) {
      // Show all workspace users by default
      return __getUserIds__(workspaceUsers);
    } else {
      const matchingUsers = __findUsers__(workspaceUsers, text);
      return __getUserIds__(matchingUsers);
    }
  },

  // Polyfill options for non-browser environments
  polyfills: {
    // atob,
    // fetch,
    // WebSocket,
  },
});

const { room, leave } = client.enterRoom("my-room-id", {
  // Options
  // ...
});
const { room, leave } = client.enterRoom("my-room-id", {
  initialPresence: {
    cursor: null,
    colors: ["red", "purple"],
    selection: {
      id: 72426,
    },
  },

  // Other options
  // ...
});

import { LiveList, LiveObject } from "@liveblocks/client";

const { room, leave } = client.enterRoom("my-room-id", {
  initialStorage: {
    title: "Untitled",
    shapes: new LiveList([
      new LiveObject({ type: "rectangle", color: "yellow" }),
    ]),
  },

  // Other options
  // ...
});
const room = client.getRoom("my-room");
const syncStatus = client.getSyncStatus();
// "synchronizing" | "synchronized"
client.logout();
import { defineAiTool } from "@liveblocks/client";

const myTool = defineAiTool()({
  description: "Fetch user information by ID",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "The user’s unique identifier" },
    },
    required: ["userId"],
    additionalProperties: false,
  },
  execute: async ({ userId }) => {
    const user = await getUserById(userId);
    return { data: { user } };
  },
  render: ({ result }) => (
    <AiTool title="User Lookup" icon="👤">
      {!result. data? (
        <div>Looking up user...</div>
      ) : (
        <div>Found user: {result.data.user.name}</div>
      )}
    </AiTool>
  ),
});
defineAiTool()({
  /* ... */

  execute: async () => {
    await sleep(1000);
    return { data: { user: { name: "Alice" } } };
  },

  render: ({ result }) => {
    if (result.data) {
      return <div>Found user: {result.data.user.name}</div>;
    }

    // Tool hasn’t executed yet
    return <Spinner />;
  },
});
defineAiTool()({
  /* ... */
  /* NOTE: No execute method used here! */

  render: ({ respond }) => {
    return (
      <div>
        <button
          onClick={() => {
            respond({ data: { user: { name: "Alice" } } });
          }}
        >
          Confirm
        </button>
        <button
          onClick={() => {
            respond({ cancel: true });
          }}
        >
          Cancel
        </button>
      </div>
    );
  },
});
const presence = room.getPresence();

// { cursor: { x: 363, y: 723 } }
console.log(presence);


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qcwvtjlualmcxlfkpzhg.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
