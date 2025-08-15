const session = liveblocks.prepareSession("olivier@example.com");

// Giving write access to one room, then read access to multiple rooms with a wildcard
session.allow("Vu78Rt:design:9Hdu73", session.FULL_ACCESS);
session.allow("Vu78Rt:product:*", session.READ_ACCESS);

const { body, status } = await session.authorize();

// '{ token: "j6Fga7..." }'
console.log(body);
npm install @liveblocks/node
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: "sk_dev_PZ3AMRkebhWyihY3qmxvTrPj65go0nOoUb-PTXMOgtvhxB-1oFldyYvplMD0uVFD",
});

export async function POST(request: Request) {
  // Get the current user from your database
  const user = __getUserFromDB__(request);

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: user.metadata } // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  session.allow(`${user.organization}:*`, session.READ_ACCESS);
  session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
<LiveblocksProvider authEndpoint="/api/liveblocks-auth">
  declare global
  interface Liveblocks {
    UserMeta: {
      id: string;

      // Example, use any JSON-compatible data in your metadata
      info: {
        name: string;
        avatar: string;
        colors: string[];
      }
    }

    // Other type definitions
    // ...
  }
}
// Get the current user from your database
const user = __getUserFromDB__(request);

// Start an auth session inside your endpoint
const session = liveblocks.prepareSession(
  user.id,
  {
    userInfo: {
      name: user.name,
      avatar: user.avatarUrl,
      colors: user.colorArray,
    }
  }
);
export { useSelf } from "@liveblocks/react/suspense";

function Component() {
  const { name, avatar, colors } = useSelf((me) => me.info);
}
const self = useSelf();
console.log(self.id);
console.log(self.info);
<LiveblocksProvider
  authEndpoint={async (room) => {
    // Passing custom headers and body to your endpoint
    const headers = {
      // Custom headers
      // ...

      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      // Custom body
      // ...

      room,
    });

    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers,
      body,
    });

    return await response.json();
  }}
/>
  
