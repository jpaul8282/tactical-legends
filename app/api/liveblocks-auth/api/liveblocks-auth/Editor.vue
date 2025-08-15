npm install @liveblocks/client @liveblocks/yjs yjs codemirror @codemirror/lang-javascript y-codemirror.next
npx create-liveblocks-app@latest --init --framework javascript
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { createClient } from "@liveblocks/client";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

const parent = ref(null);
const leave = ref(null);
const view = ref(null);

// Set up Liveblocks client
const client = createClient({
  publicApiKey: "pk_dev_covyb-1-pgYI4blKVeOLwB31adA-Pqqoa6S9tewgCcD4D68WQpFuvxpFpODm-B07",
});

// Enter a multiplayer room
const info = client.enterRoom("my-room");
const room = info.room;
leave.value = info.leave;

// Set up Yjs document, shared text, and Liveblocks Yjs provider
const yProvider = getYjsProviderForRoom(room);
const yDoc = yProvider.getYDoc();
const yText = yDoc.getText("codemirror");

onMounted(() => {
  // Set up CodeMirror and extensions
  const state = EditorState.create({
    doc: yText.toString(),
    extensions: [
      basicSetup,
      javascript(),
      yCollab(ytext, yProvider.awareness, { undoManager }),
    ],
  });

  // Attach CodeMirror to element
  view.current = new EditorView({
    state,
    parent: parent.value,
  });
});

onUnmounted(() => {
  view?.destroy();
  leave.value?.();
});
</script>

<template>
  <div ref="parent" />
</template>
