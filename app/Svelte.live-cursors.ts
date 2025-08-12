
<script lang="ts">
  import Cursor from "./Cursor.svelte";
  import { type Room } from "@liveblocks/client";
  import { onDestroy } from "svelte";

  /**
   * The main Liveblocks code for the example.
   * Check in src/routes/index.svelte to see the setup code.
   */

  export let room: Room;

  // Get initial values for presence and others
  let myPresence = room.getPresence();
  let others = room.getOthers();

  // Subscribe to further changes
  const unsubscribeMyPresence = room.subscribe("my-presence", (presence) => {
    myPresence = presence;
  });

  const unsubscribeOthers = room.subscribe("others", (otherUsers) => {
    others = otherUsers;
  });

  // Unsubscribe when unmounting
  onDestroy(() => {
    unsubscribeMyPresence();
    unsubscribeOthers();
  });

  // Update cursor presence to current pointer location
  function handlePointerMove(event: PointerEvent) {
    room.updatePresence({
      cursor: {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      },
    });
  }

  // When the pointer leaves the page, set cursor presence to null
  function handlePointerLeave() {
    room.updatePresence({
      cursor: null,
    });
  }

  const COLORS = [
    "#E57373",
    "#9575CD",
    "#4FC3F7",
    "#81C784",
    "#FFF176",
    "#FF8A65",
    "#F06292",
    "#7986CB",
  ];
</script>

<main on:pointerleave={handlePointerLeave} on:pointermove={handlePointerMove}>
  <!-- Show the current user's cursor location -->
  <div class="text">
    {myPresence?.cursor
      ? `${myPresence.cursor.x} × ${myPresence.cursor.y}`
      : "Move your cursor to broadcast its position to other people in the room."}
  </div>

  <!-- When others connected, iterate through others and show their cursors -->
  {#if others}
    {#each [...others] as { connectionId, presence } (connectionId)}
      {#if presence?.cursor}
        <Cursor
          color={COLORS[connectionId % COLORS.length]}
          x={presence.cursor.x}
          y={presence.cursor.y}
        />
      {/if}
    {/each}
  {/if}
</main>

<style>
  main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    place-content: center;
    place-items: center;
    touch-action: none;
  }

  .text {
    max-width: 380px;
    margin: 0 16px;
    text-align: center;
  }
</style>

  <script>
  export let color = "";
  export let x = 0;
  export let y = 0;

  /*
   * It's easily possible to smooth the animation with springs, for example:
     import { spring } from "svelte/motion";

     // Spring animation for cursor
     const coords = spring(
       { x, y },
       {
         stiffness: 0.07,
         damping: 0.35,
       }
     );

     // Update spring when x and y change
     $: coords.set({ x, y });

     // Use $coords in the template
     style={`transform: translateX(${$coords.x}px) translateY(${$coords.y}px)`}
   */

</script>

<svg
  class="cursor"
  fill="none"
  height="36"
  style={`transform: translateX(${x}px) translateY(${y}px)`}
  viewBox="0 0 24 36"
  width="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
    fill={color}
  />
</svg>

<style>
  .cursor {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
