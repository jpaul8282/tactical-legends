import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  return <h1>Hello, {userId}</h1>
}
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user = await currentUser()

  if (!user) return <div>Not signed in</div>

  return <div>Hello {user?.firstName}</div>
}
'use client'

export default function AddItem({ addItem }) {
  return (
    <form action={addItem}>
      <input value={'test'} type="text" name="name" />
      <button type="submit">Add to Cart</button>
    </form>
  )
}
'use client'

export default function UI({ addHobby }) {
  return (
    <form action={addHobby}>
      <input value={'soccer'} type="text" name="hobby" />
      <button type="submit">Submit your hobby</button>
    </form>
  )
}
