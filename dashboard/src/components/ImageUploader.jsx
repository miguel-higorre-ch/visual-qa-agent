import React, { useRef } from 'react';

function ImageUploader({ label, image, onImageSelect, variant = 'baseline' }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect({
          file,
          preview: reader.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect({
          file,
          preview: reader.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const borderColor = variant === 'baseline' ? 'border-green-300' : 'border-blue-300';
  const hoverBorder = variant === 'baseline' ? 'hover:border-green-500' : 'hover:border-blue-500';
  const bgColor = variant === 'baseline' ? 'bg-green-50' : 'bg-blue-50';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all ${borderColor} ${hoverBorder} ${bgColor} hover:bg-opacity-80`}
      >
        {image ? (
          <div className="relative">
            <img
              src={image.preview}
              alt={label}
              className="w-full h-64 object-contain rounded-xl"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs truncate">
              {image.name}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(null);
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-700 font-medium mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-500 text-sm">
              PNG, JPG up to 10MB
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploader;
