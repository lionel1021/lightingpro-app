export default function AuthPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h1>
        <p className="text-gray-600 mb-4">Choose your authentication method</p>
        <div className="space-y-4">
          <a
            href="/auth/signin"
            className="block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
          >
            Sign Up
          </a>
          <a
            href="/"
            className="block text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}