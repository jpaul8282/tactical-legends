import { auth } from '@clerk/nextjs/server'

export default function AddToCart() {
  async function addItem(formData: FormData) {
    'use server'

    const { userId } = await auth()

    if (!userId) {
      throw new Error('You must be signed in to add an item to your cart')
    }

    console.log('add item server action', formData)
  }

  return (
    <form action={addItem}>
      <input value={'test'} type="text" name="name" />
      <button type="submit">Add to Cart</button>
    </form>
  )
}
import { auth } from '@clerk/nextjs/server'

export default function AddVerifiedDomain() {
  async function addVerifiedDomain(formData: FormData) {
    'use server'

    const { userId, orgId } = await auth()

    if (!userId) {
      throw new Error('You must be signed in to add a verified domain')
    }

    if (!orgId) {
      throw new Error('No active organization found. Set one as active or create/join one')
    }

    const domain = formData.get('domain')?.toString()
    if (!domain) {
      throw new Error('Domain is required')
    }

    await clerkClient().organizations.createOrganizationDomain({
      organizationId: orgId,
      name: domain,
      enrollmentMode: 'automatic_invitation',
    })

    console.log(`Added domain ${domain} to organization ${orgId}`)
  }

  return (
    <form action={addVerifiedDomain}>
      <input placeholder="example.com" type="text" name="domain" />
      <button type="submit">Add Domain</button>
    </form>
  )
}
'use server'
import { auth } from '@clerk/nextjs/server'

export async function addItem(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('You must be signed in to add an item to your cart')
  }

  console.log('add item server action', formData)
}
