import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sakura/5 via-transparent to-sakura/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-display font-bold text-sakura mb-6 drop-shadow-[0_0_30px_rgba(255,192,203,0.5)]">
              Ꮇistic Ꭶakura Ꭲree
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Bienvenid@ a nuestra comunidad de Roleplay. Descubre eventos místicos, 
              únete a clanes y vive aventuras inolvidables.
            </p>
            <Link
              href="/events"
              className="inline-block bg-sakura hover:bg-sakura-dark text-mystic-black font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sakura-glow"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center text-sakura mb-12">
            ¿Qué ofrecemos?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Clan Card */}
            <div className="bg-mystic-dark/60 backdrop-blur-sm border border-sakura/20 rounded-2xl p-8 hover:border-sakura/40 transition-all duration-300 hover:shadow-sakura">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-2xl font-display font-semibold text-sakura mb-4">
                Clanes y Gremios
              </h3>
              <p className="text-gray-400">
                Únete a poderosos clanes, forma alianzas estratégicas y participa 
                en batallas épicas junto a otros jugadores.
              </p>
            </div>

            {/* Reports Card */}
            <div className="bg-mystic-dark/60 backdrop-blur-sm border border-sakura/20 rounded-2xl p-8 hover:border-sakura/40 transition-all duration-300 hover:shadow-sakura">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-2xl font-display font-semibold text-sakura mb-4">
                Sistema de Reportes
              </h3>
              <p className="text-gray-400">
                Mantén un registro detallado de tus aventuras, logros y eventos 
                importantes en tu jornada de roleplay.
              </p>
            </div>

            {/* Activities Card */}
            <div className="bg-mystic-dark/60 backdrop-blur-sm border border-sakura/20 rounded-2xl p-8 hover:border-sakura/40 transition-all duration-300 hover:shadow-sakura">
              <div className="text-5xl mb-4">🌸</div>
              <h3 className="text-2xl font-display font-semibold text-sakura mb-4">
                Actividades Mensuales
              </h3>
              <p className="text-gray-400">
                Participa en eventos especiales, torneos y actividades temáticas 
                que se renuevan cada mes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sakura/20 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 Ꮇistic Ꭶakura Ꭲree. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

