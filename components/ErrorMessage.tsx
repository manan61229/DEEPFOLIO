
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
        <div className="flex">
            <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 01-1 1h0a1 1 0 01-1-1V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/></svg>
            </div>
            <div>
                <strong className="font-bold">Error</strong>
                <span className="block sm:inline ml-2">{message}</span>
            </div>
        </div>
    </div>
  );
};
