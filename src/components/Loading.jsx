import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Icon Container */}
                <div className="relative h-16 w-16">
                    <BiLoaderAlt className="absolute inset-0 h-full w-full animate-spin text-purple-600 opacity-75" />
                </div>

                {/* Loading Text */}
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                    <span className="animate-bounce delay-100">L</span>
                    <span className="animate-bounce delay-200">o</span>
                    <span className="animate-bounce delay-300">a</span>
                    <span className="animate-bounce delay-400">d</span>
                    <span className="animate-bounce delay-500">i</span>
                    <span className="animate-bounce delay-600">n</span>
                    <span className="animate-bounce delay-700">g</span>
                    <span className="animate-bounce delay-800">.</span>
                    <span className="animate-bounce delay-900">.</span>
                    <span className="animate-bounce delay-1000">.</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-full animate-progressBar bg-gradient-to-r from-purple-500 to-pink-500" />
                </div>
            </div>
        </div>
    );
};

const styles = `
  @keyframes progressBar {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-progressBar {
    animation: progressBar 2s linear infinite;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default Loading;