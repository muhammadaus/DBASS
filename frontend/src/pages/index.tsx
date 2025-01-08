import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContentFactory from '../../../content-factory-hardhat/artifacts/contracts/ContentFactory.sol/ContentFactory.json';

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContentFactory.abi,
        signer
      );

      const contentHash = ethers.id(content);
      const contentURI = `ipfs://your-content-uri/${title}`;

      const tx = await contract.submitContent(contentHash, contentURI);
      await tx.wait();
      
      alert('Content submitted successfully!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error submitting content:', error);
      alert('Error submitting content. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 
                bg-clip-text text-transparent mb-2">
                Content Platform
              </h1>
              <p className="text-purple-200 text-lg">Create, Share, and Mint Your Content</p>
            </div>
            
            {/* Wallet Button */}
            {!account ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 
                  hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl
                  transition-all duration-200 transform hover:scale-105 shadow-lg 
                  hover:shadow-purple-500/25"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm 
                rounded-xl px-6 py-3 border border-purple-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-100 font-medium">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Submit Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20
              shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white mb-8">Submit Content</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-purple-200 text-lg mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 text-white rounded-xl 
                      px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      placeholder-purple-300/30 transition-all duration-200"
                    placeholder="Enter your title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-lg mb-2">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 text-white rounded-xl 
                      px-4 py-3 h-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      placeholder-purple-300/30 transition-all duration-200 resize-none"
                    placeholder="Write your content here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !account}
                  className={`w-full bg-gradient-to-r from-cyan-500 to-purple-500 
                    hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 
                    rounded-xl transition-all duration-200 transform hover:scale-105
                    ${(loading || !account) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-purple-500/25'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      <span>Submitting...</span>
                    </div>
                  ) : 'Submit Content'}
                </button>
              </form>
            </div>

            {/* Content List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20
              shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white mb-8">Recent Content</h2>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-purple-500/10">
                  <h3 className="text-xl font-bold text-white mb-3">Example Title</h3>
                  <p className="text-purple-200 mb-6">
                    This is an example content entry. Real content will be loaded from the blockchain.
                  </p>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 
                    hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 
                    rounded-xl transition-all duration-200 transform hover:scale-105
                    hover:shadow-lg hover:shadow-emerald-500/25">
                    Bookmark as NFT (0.01 ETH)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 