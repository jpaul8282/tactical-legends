"Use client";

import {
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { Room } from "./Room";

export default function App() {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_covyb-1-pgYI4blKVeOLwB31adA-Pqqoa6S9tewgCcD4D68WQpFuvxpFpODm-B07"}>
      <RoomProvider id="my-room">
        {/* ... */}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
"Use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Room } from "./Room";

export default function App() {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_covyb-1-pgYI4blKVeOLwB31adA-Pqqoa6S9tewgCcD4D68WQpFuvxpFpODm-B07"}>
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <Room />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
import AddItem from './components/AddItem'
import { addItem } from './actions'
export default function Hobby() {
  return <AddItem addItem={addItem} />
}
import AddHobby from './components/AddHobby'
import { addHobby } from './actions'
export default function Hobby() {
  return <AddHobby addHobby={addHobby} />
}
