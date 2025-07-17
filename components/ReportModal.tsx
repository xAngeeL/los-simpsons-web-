'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface EpisodeReport {
  season_id: number
  episode_number: number
  title: string
}

interface MovieReport {
  slug: string
  title: string
}

interface ReportModalProps {
  episode?: EpisodeReport
  movie?: MovieReport
  onClose: () => void
}

export function ReportModal({ episode, movie, onClose }: ReportModalProps) {
  const [problemType, setProblemType] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isMovie = !!movie

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!problemType) {
      toast.error('Selecciona el tipo de problema.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: isMovie ? 'pelicula' : 'episodio',
          slug: isMovie ? movie?.slug : undefined,
          seasonID: episode?.season_id,
          episodeNumber: episode?.episode_number,
          problemType,
          description,
          email,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('✅ Reporte enviado correctamente.')
        onClose()
      } else {
        toast.error(`❌ Error: ${data.message}`)
      }
    } catch (error) {
      toast.error('❌ Error al enviar el reporte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2">🚨 Reportar Problema</h2>
        <p className="text-sm text-gray-300 mb-4">
          {isMovie
            ? `🎬 ${movie?.title}`
            : `S${episode?.season_id}E${episode?.episode_number}: ${episode?.title}`}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-semibold">
            Tipo de problema *
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            >
              <option value="">Selecciona el tipo de problema</option>
              <option value="El enlace no funciona">El enlace no funciona</option>
              <option value="El vídeo no carga">El vídeo no carga</option>
              <option value="Es el episodio incorrecto">Es el episodio incorrecto</option>
              <option value="Mala calidad de video">Mala calidad de video</option>
              <option value="Problemas de audio">Problemas de audio</option>
              <option value="Problemas con subtítulos">Problemas con subtítulos</option>
              <option value="Otro problema">Otro problema</option>
            </select>
          </label>

          <label className="block mb-2 text-sm font-semibold">
            Descripción del problema
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              rows={4}
              maxLength={1000}
              placeholder="Describe con más detalle el problema que encontraste..."
            />
          </label>

          <label className="block mb-4 text-sm font-semibold">
            Tu email (opcional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              placeholder="tu@email.com"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
