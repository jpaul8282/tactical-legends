'use client'

export default function AddItem({ addItem }) {
  return (
    <form action={addItem}>
      <input value={'test'} type="text" name="name" />
      <button type="submit">Add to Cart</button>
    </form>
  )
}
