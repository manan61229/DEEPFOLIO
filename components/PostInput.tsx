
import React from 'react';

interface PostInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PostInput: React.FC<PostInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      id="posts-input"
      value={value}
      onChange={onChange}
      rows={10}
      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
      placeholder={
`Paste posts here. For best results, use one post per line with a date.
Example:
2024-07-26: Just launched my new project, DeepFolio AI! It uses Gemini to generate career timelines from resumes. #AI #React
2024-06-15: Excited to announce I've completed the Google Cloud Professional certification!`
      }
    />
  );
};
