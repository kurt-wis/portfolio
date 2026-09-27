import { useEffect, useState } from 'react'
import { 
  collection, onSnapshot, query, orderBy, deleteDoc, doc, Timestamp 
} from 'firebase/firestore'
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged, User 
} from 'firebase/auth'
import { Link } from 'react-router-dom'
import { db, auth } from '../firebase'

interface Note {
  id: string;
  text: string;
  color: string;
  timestamp: Timestamp | null;
  userId: string;
}

export default function AdminWall() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setNotes([])
      return
    }
    setIsLoading(true)
    const q = query(collection(db, 'notes'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Note[] = []
      snapshot.forEach((d) => {
        fetched.push({ id: d.id, ...d.data() } as Note)
      })
      setNotes(fetched)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError('Invalid email or password')
    }
    setIsLoggingIn(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    try {
      await deleteDoc(doc(db, 'notes', id))
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Delete failed. Check Firestore rules.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-bg-soft border border-line rounded-xl p-6 shadow-xl">
          <h1 className="text-xl font-bold text-ink mb-1">Admin Login</h1>
          <p className="text-xs text-ink-soft mb-5">Only Kurt can access this page.</p>

          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-bg text-ink mb-3 focus:outline-none focus:border-line-strong"
          />

          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-bg text-ink mb-3 focus:outline-none focus:border-line-strong"
          />

          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-ink text-bg py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>

          <Link to="/" className="block text-center text-xs text-ink-soft mt-4 hover:text-ink transition-colors">
            ← back to portfolio
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">Admin Note Wall</h1>
            <p className="text-xs text-ink-soft mt-1">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} • logged in as {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-line text-ink-soft hover:text-ink hover:border-line-strong transition-colors"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-ink-soft py-20">No notes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                style={{ backgroundColor: note.color }}
                className="relative p-4 rounded-lg shadow-md text-black flex flex-col justify-between min-h-[130px]"
              >
                <p className="text-sm font-medium break-words pr-7">{note.text}</p>
                <div className="text-[0.65rem] text-right mt-2 text-black/50">
                  {note.timestamp
                    ? note.timestamp.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Just now'}
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-sm leading-none hover:bg-red-600 transition-colors"
                  aria-label="Delete note"
                  title="Delete note"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}