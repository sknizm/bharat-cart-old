// app/_sites/[slug]/page.tsx
export default function StoreHome({ params }: { params: { slug: string } }) {
  return <div className="p-4">🏪 This is {params.slug}.lvh.me</div>
}
