
import React from 'react';
import type { TimelineEvent } from '../types';
import { BriefcaseIcon, CodeBracketIcon, AcademicCapIcon, TrophyIcon, UsersIcon, SparklesIcon as OtherIcon } from './IconComponents';

interface TimelineProps {
  events: TimelineEvent[];
}

const eventTypeIcons: Record<TimelineEvent['type'], React.FC<{className?: string}>> = {
    Work: BriefcaseIcon,
    Project: CodeBracketIcon,
    Learning: AcademicCapIcon,
    Achievement: TrophyIcon,
    Community: UsersIcon,
    Other: OtherIcon
};
const eventTypeColors: Record<TimelineEvent['type'], string> = {
    Work: 'text-blue-400',
    Project: 'text-purple-400',
    Learning: 'text-green-400',
    Achievement: 'text-yellow-400',
    Community: 'text-orange-400',
    Other: 'text-gray-400'
};

const ConfidenceBadge: React.FC<{ confidence: 'high' | 'medium' | 'low' }> = ({ confidence }) => {
  const confidenceStyles = {
    high: 'bg-green-500/10 text-green-300 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    low: 'bg-red-500/10 text-red-300 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${confidenceStyles[confidence]}`}>
      {confidence}
    </span>
  );
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-gray-700/50 text-gray-300 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
        {children}
    </span>
);

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => {
          const Icon = eventTypeIcons[event.type] || OtherIcon;
          const iconColor = eventTypeColors[event.type] || 'text-gray-400';

          return (
            <li 
              key={event.date + event.title}
              className="stagger-child"
              style={{ animationDelay: `${eventIdx * 100}ms` }}
            >
              <div className="relative pb-10">
                {eventIdx !== events.length - 1 ? (
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-700" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center ring-8 ring-gray-800">
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 shadow-md">
                      <div className="flex justify-between items-center text-sm">
                          <p className="font-medium text-gray-400">{event.date}</p>
                          <ConfidenceBadge confidence={event.confidence} />
                      </div>
                    <h3 className="text-lg font-bold text-gray-100 mt-2">{event.title}</h3>
                    <p className={`text-sm font-semibold mt-1 ${iconColor}`}>{event.type}</p>
                    <div className="mt-3 text-sm text-gray-300 space-y-2">
                      {event.bullets.map((bullet, i) => (
                          <p key={i} className="flex items-start">
                            <span className={`mr-3 mt-1 text-xs ${iconColor}`}>◆</span>
                            <span>{bullet}</span>
                          </p>
                      ))}
                    </div>
                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-4 border-t border-gray-700 pt-3">
                        {event.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                      </div>
                    )}
                     {event.inference_explanation && (
                      <p className="mt-3 text-xs text-gray-500 italic">
                        <strong>AI Note:</strong> {event.inference_explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};