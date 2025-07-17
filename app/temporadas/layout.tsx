import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1E3D] to-[#1E3A8A] text-white">
      {/* Breadcrumb para vista de temporada */}
      <div className="px-4 pt-4">
        <nav className="flex items-center text-sm text-gray-400 gap-2">
          <Link href="/" className="hover:text-white flex items-center gap-1 text-yellow-400">
            <Home size={14} /> Inicio
          </Link>
          <span className="text-gray-500">›</span>
          <span className="text-white font-semibold">Temporadas</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
