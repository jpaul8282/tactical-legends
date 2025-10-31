npm install effector
import { createStore } from "effector";

const $counter = createStore(0);
import { createStore, createEvent } from "effector";

const incremented = createEvent();
const decremented = createEvent();

const $counter = createStore(0);
import { createEvent, createStore } from "effector";

const $counter = createStore(0);

const incremented = createEvent();
const decremented = createEvent();

$counter.on(incremented, (counter) => counter + 1);
$counter.on(decremented, (counter) => counter - 1);

// and call it somewhere in your app
incremented();
// counter will increase by 1
decremented();
// counter will decrease by -1
decremented();
// counter will decrease by -1
npm install effector effector-react
import { useUnit } from "effector-react";
import { createEvent, createStore } from "effector";
import { $counter, incremented, decremented } from "./counter.js";

export const Counter = () => {
  const [counter, onIncremented, onDecremented] = useUnit([$counter, incremented, decremented]);
  // or
  const { counter, onIncremented, onDecremented } = useUnit({ $counter, incremented, decremented });
  // or
  const counter = useUnit($counter);
  const onIncremented = useUnit(incremented);
  const onDecremented = useUnit(decremented);

  return (
    <div>
      <h1>Count: {counter}</h1>
      <button onClick={onIncremented}>Increment</button>
      <button onClick={onDecremented}>Decrement</button>
    </div>
  );
};
import { createStore, createEvent, createEffect, is } from "effector";

const $counter = createStore(0);
const event = createEvent();
const fx = createEffect(() => {});

// Check if value is a unit
is.unit($counter); // true
is.unit(event); // true
is.unit(fx); // true
is.unit({}); // false
import { createEvent } from "effector";

// create event
const formSubmitted = createEvent();

// subscribe to the event
formSubmitted.watch(() => console.log("Form submitted!"));

// Trigger the event
formSubmitted();

// Output:
// "Form submitted!"
import { createStore, createEvent } from "effector";

// create event
const superAdded = createEvent();

// create store
const $supers = createStore([
  {
    name: "Spider-man",
    role: "hero",
  },
  {
    name: "Green goblin",
    role: "villain",
  },
]);

// update store on event triggered
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// trigger event
superAdded({
  name: "Rhino",
  role: "villain",
});
import { createEffect } from "effector";

// Create an effect
const fetchUserFx = createEffect(async (userId) => {
  const response = await fetch(`/api/user/${userId}`);
  return response.json();
});

// Subscribe to effect results
fetchUserFx.done.watch(({ result }) => console.log("User data:", result));
// If effect throw error we will catch it via fail event
fetchUserFx.fail.watch(({ error }) => console.log("Error occurred! ", error));

// Trigger effect
fetchUserFx(1);
import { createStore, createEvent } from "effector";

// Create an event
const superAdded = createEvent();

// Create a store
const $supers = createStore([
  {
    name: "Spider-Man",
    role: "hero",
  },
  {
    name: "Green Goblin",
    role: "villain",
  },
]);

// Create derived stores based on $supers
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

// Update the store when the event is triggered
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// Add a new character
superAdded({
  name: "Rhino",
  role: "villain",
});
import { createStore, createEvent, createEffect } from "effector";

// Define our stores
const $supers = createStore([]);
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

// Create events
const superAdded = createEvent();

// Create effects for fetching data
const getSupersFx = createEffect(async () => {
  const res = await fetch("/server/api/supers");
  if (!res.ok) {
    throw new Error("something went wrong");
  }
  const data = await res.json();
  return data;
});

// Create effects for saving new data
const saveNewSuperFx = createEffect(async (newSuper) => {
  // Simulate saving a new super
  await new Promise((res) => setTimeout(res, 1500));
  return newSuper;
});

// When the data fetch is successful, set the data
$supers.on(getSupersFx.done, ({ result }) => result);
// Add a new super
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// Trigger the data fetch
getSupersFx();
import { createStore, createEvent, createEffect, sample } from "effector";

const $supers = createStore([]);
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

const superAdded = createEvent();

const getSupersFx = createEffect(async () => {
  const res = await fetch("/server/api/supers");
  if (!res.ok) {
    throw new Error("something went wrong");
  }
  const data = await res.json();
  return data;
});

const saveNewSuperFx = createEffect(async (newSuper) => {
  // Simulate saving a new super
  await new Promise((res) => setTimeout(res, 1500));
  return newSuper;
});

$supers.on(getSupersFx.done, ({ result }) => result);
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// when clock triggered called target and pass data
sample({
  clock: superAdded,
  target: saveNewSuperFx,
});

// when saveNewSuperFx successfully done called getSupersFx
sample({
  clock: saveNewSuperFx.done,
  target: getSupersFx,
});

// Trigger the data fetch
getSupersFx();
npm install effector
npm install effector effector-react
import { createStore } from "https://cdn.jsdelivr.net/npm/effector/effector.mjs";
npm install -ED @effector/swc-plugin @swc/core
const add = createEvent()
const sub = createEvent()
const reset = createEvent()
  
const $counter = createStore(0)
  
$counter.watch(n => console.log('counter: ', n))
// counter: 0
add.watch(() => console.log('add'))
sub.watch(() => console.log('subtract'))
reset.watch(() => console.log('reset counter'))

$counter
  .on(add, (count, num) => count + num)
  .on(sub, (count, num) => count - num)
  .reset(reset)
  
add(2)
// counter: 2
// add
sub(1)
// counter: 1
// subtract
reset()
// counter: 0
// reset counter

import ReactDOM from 'react-dom'
import {createStore, createEffect, sample} from 'effector'
import {useList} from 'effector-react'

const getAllIdsFx = createEffect(async () => [1, 2, 3])

const getPostsByIdsFx = createEffect(ids =>
  Promise.all(
    ids.map(async id => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${id}`
      )
      const posts = await res.json()
      return {id, posts}
    })
  )
)

sample({
  clock: getAllIdsFx.doneData,
  target: getPostsByIdsFx,
})

const postGroups = createStore([]).on(
  getPostsByIdsFx.doneData,
  (list, result) => [...list, ...result]
)

function App() {
  return useList(postGroups, ({id, posts}) =>
    posts.map(({title, body}) => (
      <div>
        {title}
        <br />
        {body}
        <hr />
      </div>
    ))
  )
}
ReactDOM.render(<App />, document.getElementById('root'))

await getAllIdsFx()

import React from 'react'
import ReactDOM from 'react-dom'
import {createEvent, createStore} from 'effector'
import {useUnit} from 'effector-react'

const openModal = createEvent()
const closeModal = createEvent()

const $modalOpened = createStore(false)

$modalOpened.on(openModal, () => true)
$modalOpened.on(closeModal, () => false)


const App = () => {
  const [onOpenModal, onCloseModal] = useUnit([openModal, closeModal])
  const [modalOpened] = useUnit([$modalOpened])

  return (
    <>
      <button
        onClick={() => onOpenModal()}
        class="spectrum-Button spectrum-Button--cta spectrum-Button--sizeS"
      >
        <span class="spectrum-Button-label">Open</span>
      </button>

      <div
        class={"spectrum-Dialog dialog-example "+ (modalOpened ? "is-open" : "")}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
      >
        <div class="spectrum-Dialog-grid">
          <h1 class="spectrum-Dialog-heading">Disclaimer</h1>
          <hr class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--horizontal spectrum-Dialog-divider" />
          <section class="spectrum-Dialog-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor
            augue mauris augue neque gravida. Libero volutpat sed ornare arcu.
            Quisque egestas diam in arcu cursus euismod quis viverra. Posuere ac
            ut consequat semper viverra nam libero justo laoreet. Enim ut tellus
            elementum sagittis vitae et leo duis ut. Neque laoreet suspendisse
            interdum consectetur libero id faucibus nisl. Diam volutpat commodo
            sed egestas egestas. Dolor magna eget est lorem ipsum dolor. Vitae
            suscipit tellus mauris a diam maecenas sed. Turpis in eu mi bibendum
            neque egestas congue. Rhoncus est pellentesque elit ullamcorper
            dignissim cras lobortis.
          </section>
          <button
            onClick={() => onCloseModal()}
            class="spectrum-Button spectrum-Button--cta spectrum-Button--sizeS"
          >
            <span class="spectrum-Button-label">Close</span>
          </button>
        </div>
      </div>
    </>
  )
}

css`
  .dialog-example {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    overflow: auto;
  }
`

ReactDOM.render(<App />, document.getElementById('root'))

function css(tags, ...attrs) {
  const value = style(tags, ...attrs)
  const node = document.createElement('style')
  node.id = 'insertedStyle'
  node.appendChild(document.createTextNode(value))
  const sheet = document.getElementById('insertedStyle')
  if (sheet) {
    sheet.disabled = true
    sheet.parentNode.removeChild(sheet)
  }
  document.head.appendChild(node)

  function style(tags, ...attrs) {
    if (tags.length === 0) return ''
    let result = ' ' + tags[0]
    for (let i = 0; i < attrs.length; i++) {
      result += attrs[i]
      result += tags[i + 1]
    }
    return result
  }
}
import React from 'react'
import ReactDOM from 'react-dom'
import {createEvent, createStore} from 'effector'
import {useUnit} from 'effector-react'

const fooChange = createEvent()
const fooValue = createStore(4).on(fooChange, (_, e) => e)

const barChange = createEvent()
const barValue = createStore(4).on(barChange, (_, e) => e)

const RangeGroup = ({name, value, onChange}) => {
  const [current, changeHandler] = useUnit([value, onChange])
  return (
    <>
      <label for={name}>{name}</label>
      <input
        name={name}
        type="range"
        min="2"
        max="10"
        step="1"
        value={current}
        onChange={e => changeHandler(+e.currentTarget.value)}
      />
      <output for={name}>{current}</output>
    </>
  )
}

const App = () => {
  return (
    <>
      <form>
        <RangeGroup name="foo" onChange={fooChange} value={fooValue} />
        <RangeGroup name="bar" onChange={barChange} value={barValue} />
      </form>
    </>
  )
}

css`
  body {
    margin: 17px 14px;
    -webkit-font-smoothing: antialiased;
  }
  input[type='range'] {
    vertical-align: middle;
    margin: 1px;
    width: 180px;
  }
  output {
    vertical-align: middle;
    margin-left: 0.5em;
    font: 400 1.2rem sans-serif;
  }
  label {
    font: 200 1.1rem sans-serif;
    display: flex;
  }
`

ReactDOM.render(<App />, document.getElementById('root'))

function css(tags, ...attrs) {
  const value = style(tags, ...attrs)
  const node = document.createElement('style')
  node.id = 'insertedStyle'
  node.appendChild(document.createTextNode(value))
  const sheet = document.getElementById('insertedStyle')
  if (sheet) {
    sheet.disabled = true
    sheet.parentNode.removeChild(sheet)
  }
  document.head.appendChild(node)

  function style(tags, ...attrs) {
    if (tags.length === 0) return ''
    let result = ' ' + tags[0]
    for (let i = 0; i < attrs.length; i++) {
      result += attrs[i]
      result += tags[i + 1]
    }
    return result
  }
}
import React from 'react'
import ReactDOM from 'react-dom'

import {createEvent, createStore} from 'effector'
import {useUnit} from 'effector-react'

const toggle = createEvent()
const $isChecked = createStore(false)
	.on(toggle, checked => !checked)
const ThemeSwitcher = () => {
  const [isChecked, onChange] = useUnit([$isChecked, toggle])
  return (
    <input
      type="checkbox"
      id="themeSwitch"
      name="theme-switch"
      class="theme-switch__input"
      checked={isChecked}
      onChange={onChange}
    />
  )
}

const App = () => (
	<div>
    <ThemeSwitcher />
    <label for="themeSwitch" class="theme-switch__label">
      <span>Switch theme</span>
    </label>

    <main>
      <div class="wrapper">
      <h1>CSS Theme Switcher</h1>
      <p>Switch from light to dark mode using the toggle.</p>
      </div>
    </main>
  </div>
)
ReactDOM.render(<App/>, document.getElementById('root'))

style`
@import url("https://fonts.googleapis.com/css?family=Merriweather:400,400i,700");
* {
  box-sizing: border-box;
}

body {
  font-family: Merriweather, serif;
}

label,
main {
  background: var(--bg, white);
  color: var(--text, black);
}

main {
  --gradDark: hsl(144, 100%, 89%);
  --gradLight: hsl(42, 94%, 76%);
  background: linear-gradient(to bottom, var(--gradDark), var(--gradLight));
  padding: 120px 40px 40px 40px;
  min-height: 100vh;
  text-align: center;
}

.wrapper {
  max-width: 700px;
  margin: 0 auto;
}

.theme-switch__input:checked ~ main,
.theme-switch__input:checked ~ label {
  --text: white;
}

.theme-switch__input:checked ~ main {
  --gradDark: hsl(198, 44%, 11%);
  --gradLight: hsl(198, 39%, 29%);
}

.theme-switch__input,
.theme-switch__label {
  position: absolute;
  z-index: 1;
}

.theme-switch__input {
  opacity: 0;
}
.theme-switch__input:hover + .theme-switch__label, .theme-switch__input:focus + .theme-switch__label {
  background-color: lightSlateGray;
}
.theme-switch__input:hover + .theme-switch__label span::after, .theme-switch__input:focus + .theme-switch__label span::after {
  background-color: #d4ebf2;
}

.theme-switch__label {
  padding: 20px;
  margin: 60px;
  transition: background-color 70ms ease-in-out;
  width: 120px;
  height: 50px;
  border-radius: 50px;
  text-align: center;
  background-color: slateGray;
  box-shadow: -4px 4px 15px inset rgba(0, 0, 0, 0.4);
}
.theme-switch__label::before, .theme-switch__label::after {
  font-size: 2rem;
  position: absolute;
  transform: translate3d(0, -50%, 0);
  top: 50%;
}
.theme-switch__label::before {
  content: '\\263C';
  right: 100%;
  margin-right: 10px;
  color: orange;
}
.theme-switch__label::after {
  content: '\\263E';
  left: 100%;
  margin-left: 10px;
  color: lightSlateGray;
}
.theme-switch__label span {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  width: 100%;
}
.theme-switch__label span::after {
  position: absolute;
  top: calc(100% + 15px);
  left: 5px;
  width: 40px;
  height: 40px;
  content: '';
  border-radius: 50%;
  background-color: lightBlue;
  transition: transform 70ms, background-color 70ms;
  box-shadow: -3px 3px 8px rgba(0, 0, 0, 0.4);
}

.theme-switch__input:checked ~ .theme-switch__label {
  background-color: lightSlateGray;
}
.theme-switch__input:checked ~ .theme-switch__label::before {
  color: lightSlateGray;
}
.theme-switch__input:checked ~ .theme-switch__label::after {
  color: turquoise;
}
.theme-switch__input:checked ~ .theme-switch__label span::after {
  transform: translate3d(70px, 0, 0);
}
`

function style([tag]) {
  const node = document.createElement('style')
  node.id = "insertedStyle"
  node.appendChild(document.createTextNode(tag))
  const sheet = document.getElementById('insertedStyle')
  if (sheet) {
    sheet.disabled = true;
    sheet.parentNode.removeChild(sheet)
  }
  document.head.appendChild(node)
}
import { createStore } from 'effector';
import { produce } from 'immer';

const $users = createStore<User[]>([]);

$users.on(userUpdated, (users, updatedUser) =>
  produce(users, (draft) => {
    const user = draft.find((u) => u.id === updatedUser.id);
    if (user) {
      user.profile.settings.theme = updatedUser.profile.settings.theme;
    }
  }),
);
export const appStarted = createEvent();
import { createStore, createEvent, createEffect } from 'effector';
import { debug } from 'patronum/debug';

const event = createEvent();
const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
const $store = createStore(0)
  .on(event, (state, value) => state + value)
  .on(effect.done, (state) => state * 10);

debug($store, event, effect);

event(5);
effect('demo');

// => [store] $store 1
// => [event] event 5
// => [store] $store 6
// => [effect] effect demo
// => [effect] effect.done {"params":"demo", "result": "resultdemo"}
// => [store] $store 60
import { createAction } from 'effector-action';

const submitForm = createAction({
  source: {
    form: $form,
    settings: $settings,
    user: $user,
  },
  target: {
    submitFormFx,
    showErrorMessageFx,
    sendNotificationFx,
  },
  fn: (target, { form, settings, user }) => {
    if (!form.isValid) {
      target.showErrorMessageFx(form.errors);
      return;
    }

    target.submitFormFx({
      data: form,
      theme: settings.theme,
    });
  },
});

createAction(submitFormFx.done, {
  source: $settings,
  target: sendNotificationFx,
  fn: (sendNotification, settings) => {
    if (settings.sendNotifications) {
      sendNotification();
    }
  },
});

submitForm();
const updateUserNameFx = createEffect(() => {});

const userNameUpdated = createEvent();

const $userName = createStore('JS');

$userName.on(userNameUpdated, (_, newName) => newName);

userNameUpdated('TS');
// separate effects for side effects
const saveToStorageFx = createEffect((user: User) =>
  localStorage.setItem('user', JSON.stringify(user)),
);

const trackUpdateFx = createEffect((user: User) => api.trackUserUpdate(user));

// connect through sample
sample({
  clock: $user,
  target: [saveToStorageFx, trackUpdateFx],
});

// for events also use sample
sample({
  clock: $user,
  fn: (user) => user.id,
  target: someEvent,
});
$users.on(userAdded, (users, newUser) => [...users, newUser]);

sample({
  clock: buttonClicked,
  source: $userData,
  fn: (userData) => userData,
  target: updateUserFx,
});
const loginFx = createEffect((params) => api.login(params));
// Connect through sample
sample({
  clock: loginFx.doneData,
  target: [
    $user, // update store
    redirectToDashboardFx,
    showWelcomeNotificationFx,
  ],
});
// get values through parameters
const submitFormFx = createEffect(({ form, userId, theme }) => {});

// get all necessary data through sample
sample({
  clock: formSubmitted,
  source: {
    form: $form,
    user: $user,
    settings: $settings,
  },
  fn: ({ form, user, settings }) => ({
    form,
    userId: user.id,
    theme: settings.theme,
  }),
  target: submitFormFx,
});
// Don't think about implementation yet — just declare the fact
const searchInputChanged = createEvent();
const buttonClicked = createEvent();
// Event – fact of an action
const repoStarToggled = createEvent();

// Effects as additional reactions to events
// (assuming effects return updated values)
const starRepoFx = createEffect(() => {});
const unstarRepoFx = createEffect(() => {});

// Application state
const $isRepoStarred = createStore(false);
const $repoStarsCount = createStore(0);

// Toggle star logic
sample({
  clock: repoStarToggled,
  source: $isRepoStarred,
  fn: (isRepoStarred) => !isRepoStarred,
  target: $isRepoStarred,
});

// Send request to server when star is toggled
sample({
  clock: $isRepoStarred,
  filter: (isRepoStarred) => isRepoStarred,
  target: starRepoFx,
});

sample({
  clock: $isRepoStarred,
  filter: (isRepoStarred) => !isRepoStarred,
  target: unstarRepoFx,
});

// Update the star count
sample({
  clock: [starRepoFx.doneData, unstarRepoFx.doneData],
  target: $repoStarsCount,
});
import { repoStarToggled, $isRepoStarred, $repoStarsCount } from "./repo.model.ts";

const RepoStarButton = () => {
  const [onStarToggle, isRepoStarred, repoStarsCount] = useUnit([
    repoStarToggled,
    $isRepoStarred,
    $repoStarsCount,
  ]);

  return (
    <div>
      <button onClick={onStarToggle}>{isRepoStarred ? "unstar" : "star"}</button>
      <span>{repoStarsCount}</span>
    </div>
  );
};
import { createEvent, split } from "effector";

const updateUserStatus = createEvent();

const { activeUserUpdated, idleUserUpdated, inactiveUserUpdated } = split(updateUserStatus, {
  activeUserUpdated: (userStatus) => userStatus === "active",
  idleUserUpdated: (userStatus) => userStatus === "idle",
  inactiveUserUpdated: (userStatus) => userStatus === "inactive",
});
import { createEvent, split } from "effector";

const updateUserStatus = createEvent();

const { activeUserUpdated, idleUserUpdated, inactiveUserUpdated, __ } = split(updateUserStatus, {
  activeUserUpdated: (userStatus) => userStatus === "active",
  idleUserUpdated: (userStatus) => userStatus === "idle",
  inactiveUserUpdated: (userStatus) => userStatus === "inactive",
});

__.watch((defaultStatus) => console.log("default case with status:", defaultStatus));
activeUserUpdated.watch(() => console.log("active user"));

updateUserStatus("whatever");
updateUserStatus("active");
updateUserStatus("default case");

// Console output:
// default case with status: whatever
// active user
// default case with status: default case
import { createStore, createEvent, split } from "effector";

type Repo = {
  // ... other properties
  isStarred: boolean;
  isWatched: boolean;
};

const toggleStar = createEvent<string>();
const toggleWatch = createEvent<string>();

const $repo = createStore<null | Repo>(null)
  .on(toggleStar, (repo) => ({
    ...repo,
    isStarred: !repo.isStarred,
  }))
  .on(toggleWatch, (repo) => ({ ...repo, isWatched: !repo.isWatched }));

const { starredRepo, unstarredRepo, __ } = split($repo, {
  starredRepo: (repo) => repo.isStarred,
  unstarredRepo: (repo) => !repo.isStarred,
});

// Debug default case
__.watch((repo) => console.log("[split toggleStar] Default case triggered with value ", repo));

// Somewhere in the app
toggleStar();
import { createStore, createEvent, createEffect, split } from "effector";

const adminActionFx = createEffect();
const secondAdminActionFx = createEffect();
const userActionFx = createEffect();
const defaultActionFx = createEffect();
// UI event
const buttonClicked = createEvent();

// Current application mode
const $appMode = createStore<"admin" | "user">("user");

// Different actions for different modes
split({
  source: buttonClicked,
  match: $appMode, // Logic depends on the current mode
  cases: {
    admin: [adminActionFx, secondAdminActionFx],
    user: userActionFx,
    __: defaultActionFx,
  },
});

// Clicking the same button performs different actions
// depending on the application mode
buttonClicked();
// -> "Performing user action" (when $appMode = 'user')
// -> "Performing admin action" (when $appMode = 'admin')
// Extending the previous code

const adminActionFx = createEffect((currentUser) => {
  // ...
});
const secondAdminActionFx = createEffect((currentUser) => {
  // ...
});

// Adding a new store
const $currentUser = createStore({
  id: 1,
  name: "Donald",
});

const $appMode = createStore<"admin" | "user">("user");

split({
  clock: buttonClicked,
  // Passing the new store as a data source
  source: $currentUser,
  match: $appMode,
  cases: {
    admin: [adminActionFx, secondAdminActionFx],
    user: userActionFx,
    __: defaultActionFx,
  },
});
const $currentTab = createStore("home");

split({
  source: pageNavigated,
  match: $currentTab,
  cases: {
    home: loadHomeDataFx,
    profile: loadProfileDataFx,
    settings: loadSettingsDataFx,
  },
});
const userActionRequested = createEvent<{ type: string; payload: any }>();

split({
  source: userActionRequested,
  match: (action) => action.type, // The function returns a string
  cases: {
    update: updateUserDataFx,
    delete: deleteUserDataFx,
    create: createUserDataFx,
  },
});
const $isAdmin = createStore(false);
const $isModerator = createStore(false);

split({
  source: postCreated,
  match: {
    admin: $isAdmin,
    moderator: $isModerator,
  },
  cases: {
    admin: createAdminPostFx,
    moderator: createModeratorPostFx,
    __: createUserPostFx,
  },
});
split({
  source: paymentReceived,
  match: {
    lowAmount: ({ amount }) => amount < 100,
    mediumAmount: ({ amount }) => amount >= 100 && amount < 1000,
    highAmount: ({ amount }) => amount >= 1000,
  },
  cases: {
    lowAmount: processLowPaymentFx,
    mediumAmount: processMediumPaymentFx,
    highAmount: processHighPaymentFx,
  },
});
const showFormErrorsFx = createEffect(() => {
  // Logic to display errors
});
const submitFormFx = createEffect(() => {
  // Logic to submit the form
});

const submitForm = createEvent();

const $form = createStore({
  name: "",
  email: "",
  age: 0,
}).on(submitForm, (_, submittedForm) => ({ ...submittedForm }));
// Separate store for errors
const $formErrors = createStore({
  name: "",
  email: "",
  age: "",
}).reset(submitForm);

// Validate fields and collect errors
sample({
  clock: submitForm,
  source: $form,
  fn: (form) => ({
    name: !form.name.trim() ? "Name is required" : "",
    email: !isValidEmail(form.email) ? "Invalid email" : "",
    age: form.age < 18 ? "Age must be 18+" : "",
  }),
  target: $formErrors,
});

// Use split for routing based on validation results
split({
  source: $formErrors,
  match: {
    hasErrors: (errors) => Object.values(errors).some((error) => error !== ""),
  },
  cases: {
    hasErrors: showFormErrorsFx,
    __: submitFormFx,
  },
});
import { fork, allSettled } from "effector";

// create a new scope
const scope = fork();

const $counter = scope.createStore(0);
const increment = scope.createEvent();

$counter.on(increment, (state) => state + 1);

// trigger the event and wait for the entire chain to complete
await allSettled(increment, { scope });

console.log(scope.getState($counter)); // 1
console.log($counter.getState()); // 0 - the original store remains unchanged
// ✅ correct usage for an effect without inner effects
const delayFx = createEffect(async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
});

// ✅ correct usage for an effect with inner effects
const authFx = createEffect(async () => {
  await loginFx();

  await Promise.all([loadProfileFx(), loadSettingsFx()]);
});
import { useUnit } from "effector-react";
import { $counter, increased, sendToServerFx } from "./model";

const Component = () => {
  const [counter, increase, sendToServer] = useUnit([$counter, increased, sendToServerFx]);

  return (
    <div>
      <button onClick={increase}>{counter}</button>
      <button onClick={sendToServer}>send data to server</button>
    </div>
  );
};
import { renderToString } from "react-dom/server";
import { fork, serialize, allSettled } from "effector";
import { Provider } from "effector-react";
import { fetchNotificationsFx } from "./model";

async function serverRender() {
  const scope = fork();

  // Load data on the server
  await allSettled(fetchNotificationsFx, { scope });

  // Render the app
  const html = renderToString(
    <Provider value={scope}>
      <App />
    </Provider>,
  );

  // Serialize state to send to the client
  const data = serialize(scope);

  return `
  <html>
    <body>
    <div id="root">${html}</div>
    <script>window.INITIAL_DATA = ${data}</script>
    </body>
  </html>
`;
}
import { hydrateRoot } from "react-dom/client";
import { fork } from "effector";

// hydrate scope with initial values
const scope = fork({
  values: window.INITIAL_DATA,
});

hydrateRoot(
  document.getElementById("root"),
  <Provider value={scope}>
    <App />
  </Provider>,
);
import "effector/enable_debug_traces";
import "effector/enable_debug_traces";

// ...rest of your code
