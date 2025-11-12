
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { PostInput } from './components/PostInput';
import { Timeline } from './components/Timeline';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { generateAllOutputs } from './services/geminiService';
import type { TimelineEvent, SimplePortfolioData } from './types';
import { BotIcon, SparklesIcon, UploadCloudIcon, ClipboardPasteIcon } from './components/IconComponents';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Controls } from './components/Controls';
import { SimplePortfolio } from './components/SimplePortfolio';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

const App: React.FC = () => {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState<string>('');
  const [postsText, setPostsText] = useState<string>('');
  const [timeline, setTimeline] = useState<TimelineEvent[] | null>(null);
  const [simplePortfolio, setSimplePortfolio] = useState<SimplePortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'deepfolio' | 'simple'>('deepfolio');

  const outputRef = useRef<HTMLDivElement>(null);

  const handleFileContent = (content: string) => {
    setResumeText(content);
  };

  const handleSubmit = useCallback(async () => {
    if (!resumeText && !postsText) {
      setError('Please upload a resume or paste some posts to generate a timeline.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeline(null);
    setSimplePortfolio(null);

    try {
      const result = await generateAllOutputs(resumeText, postsText);
      if (result.timeline && result.timeline.timeline.length > 0) {
        setTimeline(result.timeline.timeline);
      } else {
         setError('The AI could not generate a timeline. Please try refining your input.');
      }
      if(result.simplePortfolio) {
        setSimplePortfolio(result.simplePortfolio);
      } else {
         setError(prev => prev ? prev + ' Also, the AI could not generate a simple portfolio.' : 'The AI could not generate a simple portfolio. Please try refining your input.');
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred while communicating with the AI. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, postsText]);

  const handleExportPdf = () => {
    const input = outputRef.current;
    if (!input) {
      console.error("Output element not found");
      return;
    }

    const { jsPDF } = window.jspdf;
    
    // Hide scrollbar for capture
    const originalStyle = input.style.overflow;
    input.style.overflow = 'visible';

    window.html2canvas(input, {
        scale: 2,
        backgroundColor: '#1f2937', // bg-gray-800
        useCORS: true,
        logging: true,
        onclone: (document: Document) => {
          // In the cloned document, find the content and make sure it's fully visible
          const content = document.querySelector('[data-export="content"]');
          if (content instanceof HTMLElement) {
             content.style.height = 'auto';
          }
        }
    }).then((canvas: HTMLCanvasElement) => {
        // Restore scrollbar
        input.style.overflow = originalStyle;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${mode}-portfolio.pdf`);
    }).catch((err: Error) => {
        console.error("Failed to generate PDF", err);
        input.style.overflow = originalStyle;
    });
  };

  if (!user) {
    return <Auth />;
  }

  const isGenerated = !!timeline || !!simplePortfolio;

  return (
    <div className="min-h-screen text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white">
                Craft Your Professional Story with <span className="text-cyan-400">AI</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                Instantly transform your resume and social posts into a compelling career narrative. Choose between a detailed DeepFolio timeline or a classic, simple portfolio.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Column */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 backdrop-blur-sm self-start">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
              <BotIcon className="w-6 h-6 mr-3" />
              Provide Your Data
            </h2>
            <p className="text-gray-400 mb-6">Upload your resume and paste recent social media posts. The more context you provide, the better the result.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-gray-300 flex items-center mb-2">
                  <UploadCloudIcon className="w-5 h-5 mr-2" />
                  Upload Resume (.txt)
                </label>
                <FileUpload onFileRead={handleFileContent} />
              </div>
              <div>
                <label htmlFor="posts-input" className="text-lg font-semibold text-gray-300 flex items-center mb-2">
                  <ClipboardPasteIcon className="w-5 h-5 mr-2" />
                  Paste Social Posts
                </label>
                <PostInput value={postsText} onChange={(e) => setPostsText(e.target.value)} />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!resumeText && !postsText)}
              className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader className="w-6 h-6 mr-3" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  Generate Portfolio
                </>
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 backdrop-blur-sm min-h-[600px] flex flex-col">
            <Controls 
              mode={mode}
              onModeChange={setMode}
              onExport={handleExportPdf}
              isGenerationComplete={isGenerated}
            />
            <div ref={outputRef} className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4 bg-gray-800 rounded-b-lg" data-export="content">
               <div className={`p-4 ${isGenerated ? 'fade-in-up' : ''}`}>
                  {isLoading && <div className="flex justify-center items-center h-full pt-20"><Loader className="w-12 h-12" /></div>}
                  {error && <ErrorMessage message={error} />}
                  
                  {mode === 'deepfolio' && timeline && <Timeline events={timeline} />}
                  {mode === 'simple' && simplePortfolio && <SimplePortfolio data={simplePortfolio} />}

                  {!isLoading && !error && !timeline && !simplePortfolio && (
                    <div className="flex flex-col items-center justify-center h-full pt-20 text-center text-gray-500">
                      <BotIcon className="w-16 h-16 mb-4" />
                      <p className="text-xl">Your professional story will appear here.</p>
                      <p>Fill in the details on the left and click generate.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;