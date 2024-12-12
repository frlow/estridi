export async function GET() {
  return new Response(
    JSON.stringify([
      { name: 'Select account...', value: "-1" },
      { name: 'Private Account', value: '0' },
      { name: 'Company Account', value: '1' }
    ])
  )
}
