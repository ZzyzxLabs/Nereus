import { Navbar } from "@/components/navbar"
import { CreateWizard } from "@/components/create_wpg"


export default function Page() {
  return (
    <main className="min-h-svh">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 pt-6">
        <CreateWizard />
      </div>

    </main>
  )
}
