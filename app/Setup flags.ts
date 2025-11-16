// flags.ts
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

// app/page.tsx
import { createFeatureFlag } from "../flags";

export default async function Page() {
  const enabled = await createFeatureFlag("my_feature_flag")(); //Disabled by default, edit in the Statsig console
  return <div>myFeatureFlag is {enabled ? "on" : "off"}</div>
};
npm install @flags-sdk/statsig
import { statsigAdapter } from '@flags-sdk/statsig';
import { createStatsigAdapter } from '@flags-sdk/statsig';
 
const statsigAdapter = createStatsigAdapter({
  statsigServerApiKey: process.env.STATSIG_SERVER_API_KEY,
});
identify
import { dedupe, flag } from "flags/next";
import type { Identify } from "flags";
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
 
const identify = dedupe((async ({ headers, cookies }) => {
  // Your own logic to identify the user
  // Identifying the user should rely on reading cookies and headers only, and
  // not make any network requests, as it's important to keep latency low here.
  const user = await getUser(headers, cookies);
 
  return {
    userID: user.userID,
    // ... other properties
  };
}) satisfies Identify<StatsigUser>);
 
export const myFeatureGate = flag<boolean, StatsigUser>({
  key: "my_feature_gate",
  identify,
  adapter: statsigAdapter.featureGate((gate) => gate.value),
});

export const myDynamicConfig = flag<Record<string, unknown>, StatsigUser>({
  key: 'my_dynamic_config',
  adapter: statsigAdapter.dynamicConfig((config) => config.value),
  identify,
});
export const myExperiment = flag<Record<string, unknown>, StatsigUser>({
  key: 'my_experiment',
  adapter: statsigAdapter.experiment((config) => config.value),
  identify,
});
export const myAutotune = flag<Record<string, unknown>, StatsigUser>({
  key: 'my_autotune',
  adapter: statsigAdapter.autotune((config) => config.value),
  identify,
});
export const myLayer = flag<Record<string, unknown>, StatsigUser>({
  key: 'my_layer',
  adapter: statsigAdapter.layer((layer) => layer.value),
  identify,
});
app/(example)/layout.tsx
import { cookies, headers } from "next/headers";
import { statsigAdapter } from "@flags-sdk/statsig";
import { DynamicStatsigProvider } from "./dynamic-statsig-provider";
// The same identify function you use when declaring flags
// See https://flags-sdk.dev/docs/api-reference/adapters/statsig#identify-users
import { identify } from "../../identify";
 
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headersStore, cookieStore] = await Promise.all([headers(), cookies()]);
  const user = await identify({ headers: headersStore, cookies: cookieStore });
 
  // Get a reference to the Statsig SDK instance configured by the adapter
  const Statsig = await statsigAdapter.initialize();
 
  // Prepare the bootstrap data on the server, and pass it to the client
  const datafile = await Statsig.getClientInitializeResponse(user, {
    hash: "djb2", // must use this hash function for compatibility with the client
  });
 
  return (
    <DynamicStatsigProvider datafile={datafile}>
      {children}
    </DynamicStatsigProvider>
  );
}
app/(example)/dynamic-statsig-provider.tsx
"use client";
 
import { useMemo } from "react";
import type { Statsig } from "@flags-sdk/statsig";
import {
  StatsigProvider,
  useClientBootstrapInit,
} from "@statsig/react-bindings";
 
export function DynamicStatsigProvider({
  children,
  datafile,
}: {
  children: React.ReactNode;
  datafile: Awaited<ReturnType<typeof Statsig.getClientInitializeResponse>>;
}) {
  if (!datafile) throw new Error("Missing datafile");
 
  // Statsig expects a stringified datafile, but ideally the Statsig SDK
  // would accept a JSON object so we could avoid this stringification.
  const datafileString = useMemo(() => JSON.stringify(datafile), [datafile]);
 
  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string,
    datafile.user,
    datafileString
    // NOTE you could provide the Autocapture plugin here
  );
 
  return (
    <StatsigProvider user={datafile.user} client={client}>
      {children}
    </StatsigProvider>
  );
}
app/(example)/page.tsx
"use client";
 
import { useEffect } from "react";
import { useStatsigClient } from "@statsig/react-bindings";
 
export default function Page() {
  const statsigClient = useStatsigClient();
 
    // Manually log the exposure on mount
  useEffect(() => {
    statsigClient.getDynamicConfig("my_dynamic_config");
  }, [statsigClient]);
 
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => {
        // Manually log an event
        statsigClient.logEvent("click_button");
      }}
    >
      Click me
    </button>
  );
}
import { statsigAdapter, Statsig } from '@flags-sdk/statsig';
 
const statsigInitializationPromise = statsigAdapter.initialize();
 
export async function getStatsigExperiment(key: string) {
  await statsigInitializationPromise;
  return Statsig.getExperimentSync(key);
}
export const myDynamicText = flag<string, StatsigUser>({
  // Will retrieve `my_config` from Statsig
  key: 'my_config.text',
  adapter: statsigAdapter.dynamicConfig(
    (config) => config.value.text as string,
  ),
  identify,
});
 
export const myDynamicPrice = flag<number, StatsigUser>({
  // Will retrieve `my_config` from Statsig
  key: 'my_config.price',
  adapter: statsigAdapter.dynamicConfig(
    (config) => config.value.price as number,
  ),
  identify,
});
export const exampleFlag = flag<boolean, StatsigUser>({
  key: "new_feature_gate",
  ...
  adapter: statsigAdapter.featureGate((gate) => gate.value, {
    exposureLogging: true,
  })
});
 import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData as getStatsigProviderData } from '@flags-sdk/statsig';
import { mergeProviderData } from 'flags';
import * as flags from '../../../../flags';
 
export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  return mergeProviderData([
    getProviderData(flags),
    getStatsigProviderData({
      consoleApiKey: process.env.STATSIG_CONSOLE_API_KEY,
      projectId: process.env.STATSIG_PROJECT_ID,
    }),
  ]);
});
  
