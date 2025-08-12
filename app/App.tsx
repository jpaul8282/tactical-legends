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
