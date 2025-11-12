
import React from 'react';
import type { SimplePortfolioData } from '../types';
import { BriefcaseIcon, CodeBracketIcon, SparklesIcon, UserIcon } from './IconComponents';

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
    <section className="mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center border-b-2 border-gray-700 pb-2">
            {icon}
            <span className="ml-3">{title}</span>
        </h2>
        {children}
    </section>
);

const SkillTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-gray-700 text-gray-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-md">
        {children}
    </span>
);

export const SimplePortfolio: React.FC<{ data: SimplePortfolioData }> = ({ data }) => {
    return (
        <div className="text-gray-200 p-2 fade-in-up">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white">{data.name}</h1>
                <p className="text-lg text-gray-400 mt-1">{data.title}</p>
            </header>

            <Section title="Professional Summary" icon={<UserIcon className="w-6 h-6" />}>
                <p className="text-gray-300 leading-relaxed">{data.summary}</p>
            </Section>

            <Section title="Work Experience" icon={<BriefcaseIcon className="w-6 h-6" />}>
                <div className="space-y-6">
                    {data.experience.map((job, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold text-gray-100">{job.title}</h3>
                                <p className="text-sm text-gray-400">{job.date}</p>
                            </div>
                            <p className="text-md text-gray-300">{job.company}</p>
                            <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
                                {job.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <Section title="Projects" icon={<CodeBracketIcon className="w-6 h-6" />}>
                <div className="space-y-6">
                    {data.projects.map((project, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold text-gray-100">{project.title}</h3>
                                <p className="text-sm text-gray-400">{project.date}</p>
                            </div>
                            <p className="mt-1 text-gray-300">{project.description}</p>
                            <div className="mt-2">
                                {project.tech_stack.map(tech => <SkillTag key={tech}>{tech}</SkillTag>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Section title="Skills" icon={<SparklesIcon className="w-6 h-6" />}>
                <div className="space-y-4">
                    {data.skills.map((skillCategory, index) => (
                        <div key={index}>
                            <h3 className="text-md font-semibold text-gray-200 mb-2">{skillCategory.category}</h3>
                            <div>
                                {skillCategory.list.map(skill => <SkillTag key={skill}>{skill}</SkillTag>)}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};