export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Content Platform
        </h1>
        
        {/* Submit Form */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Submit Content</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Title</label>
              <input 
                type="text"
                className="w-full border rounded p-2"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block mb-1">Content</label>
              <textarea 
                className="w-full border rounded p-2 h-32"
                placeholder="Enter content"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Recent Content</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-medium">Example Title</h3>
            <p className="text-gray-600 mt-2">
              This is an example content entry. Real content will be loaded from the blockchain.
            </p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Mint NFT (0.01 ETH)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 