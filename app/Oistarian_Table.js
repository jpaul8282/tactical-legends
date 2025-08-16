
let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('id')

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('created_at')

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('*')

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('*')

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('some_column,other_column')

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select('*')
  .range(0, 9)

let { data: Oistarian_Table, error } = await supabase
  .from('Oistarian_Table')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

const { data, error } = await supabase
  .from('Oistarian_Table')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()

const { data, error } = await supabase
  .from('Oistarian_Table')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()

const { data, error } = await supabase
  .from('Oistarian_Table')
  .upsert({ some_column: 'someValue' })
  .select()

const { data, error } = await supabase
  .from('Oistarian_Table')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

const { error } = await supabase
  .from('Oistarian_Table')
  .delete()
  .eq('some_column', 'someValue')

const Oistarian_Table = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Oistarian_Table' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

const Oistarian_Table = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'Oistarian_Table' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

const Oistarian_Table = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'Oistarian_Table' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

const Oistarian_Table = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'Oistarian_Table' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

const Oistarian_Table = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Oistarian_Table', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
