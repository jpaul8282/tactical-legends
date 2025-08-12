const client = createClient({
  publicApiKey: "pk_dev_covyb-1-pgYI4blKVeOLwB31adA-Pqqoa6S9tewgCcD4D68WQpFuvxpFpODm-B07",
});
const { room, leave } = client.enterRoom("my-room");
<script>
  import { onDestroy } from "svelte";
  import { room } from "./room.js";

  let others = room.getOthers();

  const unsubscribeOthers = room.subscribe("others", (updatedOthers) => {
    others = updatedOthers;
  });

  onDestroy(() => {
    unsubscribeOthers();
  });
</script>

<div>There are {others.length} other user(s) online</div>
