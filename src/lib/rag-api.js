const API_URL = import.meta.env.VITE_RAG_API_URL

export async function sendChatMessage(message) {
  if (!API_URL) {
    return 'Chat is not configured yet. The API endpoint is missing.'
  }

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.answer
}
