import Link from 'next/link'

// Add this line right below the imports
export const dynamic = 'force-dynamic'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Authentication Failed
        </h1>
        <p className="text-gray-300 mb-8">
          Something went wrong during the sign-in process. This could be due to an invalid or expired login link, or a network issue.
        </p>
        <Link 
          href="/login" 
          className="bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}