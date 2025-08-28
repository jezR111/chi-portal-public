export default function TwTest() {
  return (
    <main className="p-8 space-y-4">
      <div className="rounded-xl bg-red-500 p-6 text-white shadow">
        Tailwind utilities working
      </div>
      <div className="rounded-xl bg-background p-6 text-foreground border">
        Tokens working (bg-background / text-foreground)
      </div>
      <div className="rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 p-6 text-white shadow">
        Custom palette working
      </div>
    </main>
  )
}
