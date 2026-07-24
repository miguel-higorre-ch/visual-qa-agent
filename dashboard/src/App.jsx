import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ComparisonView from './components/ComparisonView';
import DiffList from './components/DiffList';
import { analyzeImages } from './services/api';

function App() {
  const [baselineImage, setBaselineImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(null);

  const handleAnalyze = async () => {
    if (!baselineImage || !currentImage) {
      setError('Please upload both baseline and current images');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeImages(baselineImage, currentImage);
      setAnalysisResult(result);
      
      if (result.analysis.diffs.length === 0) {
        setError('No significant visual differences detected');
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBaselineImage(null);
    setCurrentImage(null);
    setAnalysisResult(null);
    setError(null);
    setSelectedDiff(null);
  };

  const handleDiffSelect = (diff) => {
    setSelectedDiff(selectedDiff === diff ? null : diff);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Visual QA Agent</h1>
                <p className="text-purple-200 text-sm">AI-powered visual regression testing</p>
              </div>
            </div>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader
                  label="Baseline (Correct Version)"
                  image={baselineImage}
                  onImageSelect={setBaselineImage}
                  variant="baseline"
                />
                <ImageUploader
                  label="Current (Version to Test)"
                  image={currentImage}
                  onImageSelect={setCurrentImage}
                  variant="current"
                />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !baselineImage || !currentImage}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Analyzing...</span>
                    </span>
                  ) : (
                    'Analyze Images'
                  )}
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-purple-100">
                <div>
                  <div className="text-3xl mb-2">📸</div>
                  <h4 className="font-semibold mb-2">1. Upload Images</h4>
                  <p className="text-sm">Upload your baseline and current screenshots</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-semibold mb-2">2. AI Analysis</h4>
                  <p className="text-sm">Claude analyzes differences semantically</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-2">3. Review Results</h4>
                  <p className="text-sm">See categorized diffs with severity levels</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Summary</h2>
              <p className="text-gray-700">{analysisResult.analysis.summary}</p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">
                    {analysisResult.analysis.diffs.filter(d => d.severity === 'critical').length} Critical
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-600">
                    {analysisResult.analysis.diffs.filter(d => d.severity === 'minor').length} Minor
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600">
                    {analysisResult.analysis.diffs.filter(d => d.severity === 'cosmetic').length} Cosmetic
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison and Diffs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ComparisonView
                  baselineImage={baselineImage}
                  currentImage={currentImage}
                  diffs={analysisResult.analysis.diffs}
                  selectedDiff={selectedDiff}
                />
              </div>
              <div>
                <DiffList
                  diffs={analysisResult.analysis.diffs}
                  selectedDiff={selectedDiff}
                  onDiffSelect={handleDiffSelect}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-purple-200 text-sm">
        <p>Powered by Amazon Bedrock • Built for Código Facilito Hackathon</p>
      </footer>
    </div>
  );
}

export default App;
