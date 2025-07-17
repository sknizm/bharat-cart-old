export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Store not found</h1>
        <p className="text-muted-foreground">
          The store you are looking for does not exist or has been deleted.
        </p>
      </div>
    </div>
  )
}
