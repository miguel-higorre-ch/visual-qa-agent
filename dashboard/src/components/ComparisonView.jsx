import React, { useState } from 'react';
import BoundingBox from './BoundingBox';

function ComparisonView({ baselineImage, currentImage, diffs, selectedDiff }) {
  const [view, setView] = useState('split'); // split, baseline, current, overlay

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* View Controls */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Visual Comparison</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('split')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'split'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setView('baseline')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'baseline'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => setView('current')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Current
            </button>
          </div>
        </div>
      </div>

      {/* Image Display */}
      <div className="p-6">
        {view === 'split' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-green-600 mb-2 uppercase tracking-wide">
                Baseline (Correct)
              </div>
              <div className="relative border-2 border-green-200 rounded-lg overflow-hidden">
                <img
                  src={baselineImage.preview}
                  alt="Baseline"
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wide">
                Current (Testing)
              </div>
              <div className="relative border-2 border-blue-200 rounded-lg overflow-hidden">
                <img
                  src={currentImage.preview}
                  alt="Current"
                  className="w-full"
                />
                <BoundingBox
                  diffs={selectedDiff ? [selectedDiff] : diffs}
                  imageRef={null}
                />
              </div>
            </div>
          </div>
        )}

        {view === 'baseline' && (
          <div>
            <div className="text-xs font-medium text-green-600 mb-2 uppercase tracking-wide">
              Baseline (Correct Version)
            </div>
            <div className="relative border-2 border-green-200 rounded-lg overflow-hidden">
              <img
                src={baselineImage.preview}
                alt="Baseline"
                className="w-full"
              />
            </div>
          </div>
        )}

        {view === 'current' && (
          <div>
            <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wide">
              Current (Version with Changes)
            </div>
            <div className="relative border-2 border-blue-200 rounded-lg overflow-hidden">
              <img
                src={currentImage.preview}
                alt="Current"
                className="w-full"
              />
              <BoundingBox
                diffs={selectedDiff ? [selectedDiff] : diffs}
                imageRef={null}
              />
            </div>
          </div>
        )}

        {diffs.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">💡 Tip:</span> Click on a difference in the list to highlight it on the image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonView;
