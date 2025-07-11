export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          LightingPro - AI Smart Lighting Expert
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Get personalized lighting product recommendations based on your room type, style preferences, and budget
        </p>
        <div className="text-center">
          <a 
            href="/questionnaire" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Smart Recommendations
          </a>
        </div>
      </div>
    </div>
  )
}