import { currentUser } from '@clerk/nextjs/server'

export default function AddHobby() {
  async function addHobby(formData: FormData) {
    'use server'

    const user = await currentUser()

    if (!user) {
      throw new Error('You must be signed in to use this feature')
    }

    const serverData = {
      usersHobby: formData.get('hobby'),
      userId: user.id,
      profileImage: user.imageUrl,
    }

    console.log('add item server action completed with user details ', serverData)
  }

  return (
    <form action={addHobby}>
      <input value={'soccer'} type="text" name="hobby" />
      <button type="submit">Submit your hobby</button>
    </form>
  )
}
