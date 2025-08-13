const client = createClient({
  publicApiKey: "pk_dev_covyb-1-pgYI4blKVeOLwB31adA-Pqqoa6S9tewgCcD4D68WQpFuvxpFpODm-B07",
});
const { room, leave } = client.enterRoom("my-room");
import { createSignal, onCleanup, onMount } from "solid-js";
import { room } from "./room.js";

export function Room() {
  const [other, setOthers] = createSignal(room.getOthers());

  onMount(() => {
    const unsubscribeOthers = room.subscribe("others", (updatedOthers) => {
      setOthers(updatedOthers);
    });

    onCleanup(() => {
      unsubscribeOthers();
    });
  })

  return (
    <div>There are {others.length} other user(s) online</div>
  );
}
