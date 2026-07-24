import React from 'react';

function DiffList({ diffs, selectedDiff, onDiffSelect }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cosmetic':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'minor':
        return '🟡';
      case 'cosmetic':
        return '🔵';
      default:
        return '⚪';
    }
  };

  if (diffs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Differences Found</h3>
        <p className="text-gray-600">The images appear to be identical or have only insignificant differences.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Detected Differences ({diffs.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {diffs.map((diff, index) => (
          <div
            key={index}
            onClick={() => onDiffSelect(diff)}
            className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
              selectedDiff === diff ? 'bg-purple-50 border-l-4 border-purple-600' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getSeverityIcon(diff.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(
                      diff.severity
                    )}`}
                  >
                    {diff.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {diff.bbox.x},{diff.bbox.y}
                  </span>
                </div>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {diff.description}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>📐 {diff.bbox.width}×{diff.bbox.height}px</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              🔴 {diffs.filter(d => d.severity === 'critical').length} Critical
            </span>
            <span className="text-gray-600">
              🟡 {diffs.filter(d => d.severity === 'minor').length} Minor
            </span>
            <span className="text-gray-600">
              🔵 {diffs.filter(d => d.severity === 'cosmetic').length} Cosmetic
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffList;
