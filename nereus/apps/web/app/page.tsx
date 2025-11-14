import { Navbar } from "@/components/navbar"
import { MarketGrid } from "@/components/market-grid"
import { WalrusCodeUploader } from "@/components/walrus/walrus-code-uploader"
export default function Page() {
  return (
    <main className="min-h-svh">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 pt-6">
        <MarketGrid />
      </div>
      <WalrusCodeUploader signer={null} />
    </main>
  )
}
