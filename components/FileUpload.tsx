
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, CheckCircleIcon, FileTextIcon } from './IconComponents';

interface FileUploadProps {
  onFileRead: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileRead }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileRead(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt file.');
      setFileName(null);
      onFileRead('');
    }
  }, [onFileRead]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div>
      <label
        htmlFor="file-upload"
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'}`}
      >
        <div className="text-center">
            {fileName ? <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" /> : <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />}
          
          <p className={`mt-2 text-sm ${fileName ? 'text-green-300' : 'text-gray-400'}`}>
            {fileName ? (
              <>
                <FileTextIcon className="inline w-4 h-4 mr-1"/>
                {fileName}
              </>
              ) : (
              'Drag & drop or click to upload'
            )}
          </p>
          <p className="text-xs text-gray-500">Plain text file (.txt) only</p>
        </div>
      </label>
       <input
        id="file-upload-input"
        ref={fileInputRef}
        name="file-upload"
        type="file"
        className="sr-only"
        accept=".txt"
        onChange={handleFileChange}
      />
    </div>
  );
};
