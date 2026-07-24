import React from 'react';

function BoundingBox({ diffs, imageRef }) {
  if (!diffs || diffs.length === 0) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'rgba(239, 68, 68, 0.5)'; // red
      case 'minor':
        return 'rgba(234, 179, 8, 0.5)'; // yellow
      case 'cosmetic':
        return 'rgba(59, 130, 246, 0.5)'; // blue
      default:
        return 'rgba(156, 163, 175, 0.5)'; // gray
    }
  };

  const getBorderColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#ef4444';
      case 'minor':
        return '#eab308';
      case 'cosmetic':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {diffs.map((diff, index) => (
        <g key={index}>
          {/* Bounding box rectangle */}
          <rect
            x={diff.bbox.x}
            y={diff.bbox.y}
            width={diff.bbox.width}
            height={diff.bbox.height}
            fill={getSeverityColor(diff.severity)}
            stroke={getBorderColor(diff.severity)}
            strokeWidth="3"
            strokeDasharray="8,4"
            rx="4"
          />
          
          {/* Label */}
          <foreignObject
            x={diff.bbox.x}
            y={Math.max(0, diff.bbox.y - 28)}
            width="200"
            height="24"
          >
            <div
              style={{
                backgroundColor: getBorderColor(diff.severity),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                whiteSpace: 'nowrap'
              }}
            >
              {diff.severity.toUpperCase()} #{index + 1}
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}

export default BoundingBox;
