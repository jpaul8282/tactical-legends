NEXT_PUBLIC_STATSIG_CLIENT_KEY="client-e3VqMmRftxnFSlmTjO7j6R3ysCJhJUhlpNwRREgaUS5"
STATSIG_SERVER_API_KEY="secret-qCYSmzZaFOIlCRMh57YNGecqIqvnrUT1522mvqBaOAB"
EXPERIMENTATION_CONFIG_ITEM_KEY="statsig-4mxPpX86uPTxBp04ezpLAj"
npm install flags @flags-sdk/statsig
// add flags.ts
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { flag, dedupe } from "flags/next";
import type { Identify } from "flags";

export const identify = dedupe((async () => ({
  // implement the identify() function to add any additional user properties you'd like, see docs.statsig.com/concepts/user
  userID: "1234" //for example, set userID
})) satisfies Identify<StatsigUser>);

export const createFeatureFlag = (key: string) => flag<boolean, StatsigUser>({
  key,
  adapter: statsigAdapter.featureGate((gate) => gate.value, {exposureLogging: true}),
  identify,
});
// app/my-page.tsx, or your other component
import { createFeatureFlag } from "../flags";

export default async function Page() {
  const enabled = await createFeatureFlag("my_first_gate")(); //Disabled by default, edit in the Statsig console
  return <div>myFeatureFlag is {enabled ? "on" : "off"}</div>
};
//Note: this is designed for server & middleware - check "Getting Started" for client-side details!
