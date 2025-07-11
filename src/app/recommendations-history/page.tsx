export default function RecommendationHistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recommendation History
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            View your personalized lighting recommendation history
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-500 mb-4">No recommendation history yet</p>
              <a
                href="/questionnaire"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Start Your First Recommendation
              </a>
            </div>
            <a
              href="/"
              className="inline-block text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}