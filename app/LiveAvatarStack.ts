npx create-liveblocks-app@latest --example nextjs-todo-list --api key:sk_dev_PZ3AMRkebhWyihY3qmxvTrPj65go0nOoUb-PTXMOgtvhxB-1oFldyYvplMD0uVFD


import React, { useMemo } from "react";
import { Avatar } from "../components/Avatar";
import { RoomProvider, useOthers, useSelf } from "@liveblocks/react";
import { useRouter } from "next/router";
import styles from "./index.module.css";

function Example() {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  return (
    <main className="flex h-screen w-full select-none place-content-center place-items-center">
      <div className="flex pl-3">
        {users.slice(0, 3).map(({ connectionId, info }) => {
          return (
            <Avatar key={connectionId} src={info.avatar} name={info.name} />
          );
        })}

        {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}

        {currentUser && (
          <div className="relative ml-8 first:ml-0">
            <Avatar src={currentUser.info.avatar} name="You" />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  const roomId = useExampleRoomId("liveblocks:examples:nextjs-live-avatars");

  return (
    <RoomProvider id={roomId}>
      <Example />
    </RoomProvider>
  );
}

export async function getStaticProps() {
  const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
  const API_KEY_WARNING = process.env.CODESANDBOX_SSE
    ? `Add your secret key from https://liveblocks.io/dashboard/apikeys as the \`LIVEBLOCKS_SECRET_KEY\` secret in CodeSandbox.\n` +
      `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-live-avatars#codesandbox.`
    : `Create an \`.env.local\` file and add your secret key from https://liveblocks.io/dashboard/apikeys as the \`LIVEBLOCKS_SECRET_KEY\` environment variable.\n` +
      `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-live-avatars#getting-started.`;

  if (!API_KEY) {
    console.warn(API_KEY_WARNING);
  }

  return { props: {} };
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
  const { query } = useRouter();
  const exampleRoomId = useMemo(() => {
    return query?.exampleId? `${roomId}-${query.exampleId}` : roomId;
  }, [query, roomId]);

  return exampleRoomId;
}
npx create-liveblocks-app@latest --example nextjs-live-avatars --vercel
<template>
  <main class="main">
    <div class="avatars">
      <Avatar
        v-for="user in others.slice(0, 3)"
        v-bind:key="user.connectionId"
        v-bind:src="user.avatar"
        v-bind:name="user.name"
      />

      <div v-if="others.length > 3" class="more">+{{ others.length - 3 }}</div>

      <div class="self">
        <Avatar
          v-if="currentUser"
          v-bind:src="currentUser.info.avatar"
          name="You"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.avatars {
  display: flex;
  padding-left: 12px;
}

.self {
  position: relative;
  margin-left: 32px;
}

.self:first-child {
  margin-left: 0;
}

.more {
  border-width: 4px;
  border-radius: 9999px;
  border-color: white;
  background-color: #9ca3af;
  min-width: 56px;
  width: 56px;
  height: 56px;
  margin-left: -0.75rem;
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>

<script>
import { createClient } from "@liveblocks/client";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

let roomId = "liveblocks:examples:nuxtjs-live-avatars";

export default {
  data() {
    return {
      others: [],
      currentUser: null,
    };
  },
  mounted() {
    applyExampleRoomId();

    const { room, leave } = client.enterRoom(roomId);
    this._room = room;
    this._leave = leave;
    this._unsubscribeOthers = room.subscribe("others", this.onOthersChange);
    this._unsubscribeStatus = room.subscribe("status", this.onStatusChange);
  },
  destroyed() {
    this._unsubscribeOthers();
    this._unsubscribeStatus();
    this._leave();
  },
  methods: {
    onOthersChange(others) {
      // The avatar and name are coming from the authentication endpoint
      // See api.js for and https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
      this.others = others.map((user) => ({
        connectionId: user.connectionId,
        avatar: user.info?.avatar,
        name: user.info?.name,
      }));
    },
    onStatusChange(status) {
      this.currentUser = this._room.getSelf();
    },
  },
};

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function applyExampleRoomId() {
  if (typeof window === "undefined") {
    return;
  }

  const query = new URLSearchParams(window?.location?.search);
  const exampleId = query.get("exampleId");

  if (exampleId) {
    roomId = exampleId? `${roomId}-${exampleId}` : roomId;
  }
}
</script>

<script lang="ts" setup>
import { onUnmounted, ref } from "vue";
import Avatar from "@/components/Avatar.vue";
import type { Room } from "@liveblocks/client";

const { room } = defineProps<{
  room: Room;
}>();

// Get initial values for presence and others
const currentUser = ref(room.getPresence());
const others = ref(room.getOthers());

// Subscribe to further changes
const unsubscribeMyPresence = room.subscribe("my-presence", (newPresence) => {
  currentUser.value = newPresence;
});

const unsubscribeOthers = room.subscribe("others", (newOthers) => {
  // @ts-ignore
  others.value = newOthers;
});

// Unsubscribe when unmounting
onUnmounted(() => {
  unsubscribeMyPresence();
  unsubscribeOthers();
});
</script>

<template>
  <main class="main">
    <div class="avatars">
      <Avatar
        v-for="{ presence, connectionId } in others.slice(0, 3)"
        v-bind:key="connectionId"
        v-bind:name="presence.name"
        v-bind:avatar="presence.avatar"
      />

      <div v-if="others.length > 3" class="more">+{{ others.length - 3 }}</div>

      <div class="self">
        <Avatar
          v-if="currentUser"
          name="You"
          v-bind:avatar="currentUser.avatar"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  overflow: hidden;
}

.avatars {
  display: flex;
  padding-left: 12px;
}

.self {
  position: relative;
  margin-left: 32px;
}

.self:first-child {
  margin-left: 0;
}

.more {
  border-width: 4px;
  border-radius: 9999px;
  border-color: white;
  background-color: #9ca3af;
  min-width: 56px;
  width: 56px;
  height: 56px;
  margin-left: -0.75rem;
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
<script lang="ts">
  import Avatar from "./Avatar.svelte";
  import { type Room } from "@liveblocks/client";
  import { onDestroy } from "svelte";

  /**
   * The main Liveblocks code for the example.
   * Check in src/routes/index.svelte to see the setup code.
   */

  export let room: Room;

  // Get initial values for others and self
  let users = room.getOthers();
  let currentUser = room.getSelf();

  // Subscribe to further changes
  const unsubscribeOthers = room.subscribe("others", (others) => {
    users = others;
  });

  const unsubscribeMyPresence = room.subscribe("my-presence", () => {
    currentUser = room.getSelf();
  });

  // Unsubscribe when unmounting
  onDestroy(() => {
    unsubscribeOthers();
    unsubscribeMyPresence();
  });

  $: hasMoreUsers = users ? [...users].length > 3 : false;
</script>

<main>
  <div class="avatars">
    <!-- Show the first 3 users' avatars -->
    {#if users}
      {#each [...users].slice(0, 3) as { connectionId, info } (connectionId)}
        <Avatar src={info?.avatar} name={info?.name} />
      {/each}
    {/if}

    <!-- Show the number of people online past the third user -->
    {#if hasMoreUsers}
      <div class="more">+ {[...users]?.length - 3}</div>
    {/if}

    <!-- Show the current user's avatar-->
    {#if currentUser}
      <div class="current_user_container">
        <Avatar src={currentUser.info?.avatar} name={currentUser.info?.name} />
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    user-select: none;
  }

  .avatars {
    display: flex;
    flex-direction: row;
    padding-left: 0.75rem;
  }

  .current_user_container {
    position: relative;
  }

  .current_user_container:not(:first-child) {
    margin-left: 2rem;
  }

  .more {
    display: flex;
    place-content: center;
    place-items: center;
    position: relative;
    border: 4px solid #fff;
    border-radius: 9999px;
    width: 56px;
    height: 56px;
    background-color: #9ca3af;
    margin-left: -0.75rem;
    color: #fff;
  }
</style>
Getting started

import { createSignal, onCleanup, onMount } from "solid-js";
import Avatar from "./components/Avatar.jsx";
import styles from "./App.module.css";

function App({ room }) {
  const [currentUser, setCurrentUser] = createSignal(room.getPresence());
  const [users, setUsers] = createSignal([]);
  const hasMoreUsers = () => users().length > 3;

  onMount(() => {
    const unsubscribePresence = room.subscribe("my-presence", (presence) => {
      setCurrentUser(presence);
    });

    const unsubscribeOthers = room.subscribe("others", (others) => {
      const othersWithPresence = others.filter((user) => user?.presence);
      setUsers(othersWithPresence);
    });

    onCleanup(() => {
      unsubscribePresence();
      unsubscribeOthers();
    });
  });

  return (
    <main class={styles.App}>
      <For each={users().slice(0, 3)}>
        {({ presence }) => (
          <Avatar src={presence.avatar} name={presence.name} />
        )}
      </For>

      <Show when={hasMoreUsers()}>
        <div class={styles.more}>+{users().length - 3}</div>
      </Show>

      <Show when={currentUser()}>
        <div class={styles.you}>
          <Avatar src={currentUser().avatar} name="You" />
        </div>
      </Show>
    </main>
  );
}

export default App;
Getting started



