
import React from 'react';
import { DownloadIcon } from './IconComponents';

interface ControlsProps {
  mode: 'deepfolio' | 'simple';
  onModeChange: (mode: 'deepfolio' | 'simple') => void;
  onExport: () => void;
  isGenerationComplete: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ mode, onModeChange, onExport, isGenerationComplete }) => {
  return (
    <div className="flex justify-between items-center bg-gray-900 p-2 rounded-t-lg border-b border-gray-700">
      {/* Mode Toggle */}
      <div className="relative flex items-center bg-gray-800 rounded-full p-1">
        <button
          onClick={() => onModeChange('deepfolio')}
          className={`px-4 py-1 text-sm font-semibold rounded-full relative z-10 transition-colors ${
            mode === 'deepfolio' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          DeepFolio
        </button>
        <button
          onClick={() => onModeChange('simple')}
          className={`px-4 py-1 text-sm font-semibold rounded-full relative z-10 transition-colors ${
            mode === 'simple' ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Simple Portfolio
        </button>
        <span
          className={`absolute top-1 h-8 w-1/2 bg-cyan-600 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
            mode === 'deepfolio' ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: mode === 'deepfolio' ? '98px' : '130px', left: '4px' }}
        />
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={!isGenerationComplete}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DownloadIcon className="w-4 h-4" />
        <span>Export PDF</span>
      </button>
    </div>
  );
};
