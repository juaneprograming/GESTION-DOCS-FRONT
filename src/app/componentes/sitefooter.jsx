import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">About</h3>
          <p className="text-sm leading-relaxed">
            Equita is a representative logistics operator providing full range of service in the sphere of customs cargo
            and transportation worldwide.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="bg-blue-500 rounded-full p-2 hover:bg-blue-500/90 transition-colors">
              <Facebook className="h-4 w-4 text-white" />
            </Link>
            <Link href="#" className="bg-blue-500 rounded-full p-2 hover:bg-blue-500/90 transition-colors">
              <Instagram className="h-4 w-4 text-white" />
            </Link>
            <Link href="#" className="bg-blue-500 rounded-full p-2 hover:bg-blue-500/90 transition-colors">
              <Twitter className="h-4 w-4 text-white" />
            </Link>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Services</h3>
          <ul className="space-y-2 text-sm">
            {["Warehouse", "Air Freight", "Ocean Freight", "Road Freight", "Supply Chain", "Packaging"].map(
              (service) => (
                <li key={service}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Industries Section */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Industries</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Retail & Consumer",
              "Sciences & Healthcare",
              "Industrial & Chemical",
              "Power Generation",
              "Food & Beverage",
              "Oil & Gas",
            ].map((industry) => (
              <li key={industry}>
                <Link href="#" className="hover:text-white transition-colors">
                  {industry}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Contact Section */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Quick Contact</h3>
          <p className="text-sm">If you have any questions or need help, feel free to contact with our team.</p>
          <p className="text-blue-500 text-xl font-semibold">01061245741</p>
          <p className="text-sm">2307 Beverley Rd Brooklyn, New York 11226 United States.</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
        © Copyrigth{" "}
        <Link href="#" className="text-blue-500 hover:text-blue-500/90">
          gestiondocumental@gmail.com
        </Link>
      </div>
    </footer>
  )
}
