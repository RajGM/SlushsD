import ToolCard from "@components/ToolCard";

const tools = [
    {
        icon: "/youtube.svg",
        title: "Exam Generator",
        description: "Generate an exam aligned to a topic.", 
    },
    {
        icon: "/youtube.svg",
        title: "Youtube Generator",
        description: "Generate guiding questions aligned to a YouTube video.",
    },
    {
        icon: "/text-dependent-question.svg",
        title: "Text Question",
        description: "Generate text-dependent questions for students based on any text that you input.",
    },
    {
        icon: "/text-dependent-question.svg",
        title: "Worksheet Generator",
        description: "Generate a worksheet based on any topic or text.",
    },
    {
        icon: "/text-dependent-question.svg",
        title: "MCQ Generator",
        description: "Create a multiple choice assessment based on any topic, standard(s), or criteria!",
    },
    {
        icon: "/text-summarizer.svg",
        title: "Text summarizer",
        description: "Take any text and summarize it in whatever length you choose.",
    },
    {
        icon: "/rewrite.svg",
        title: "Text Rewriter",
        description: "Take any text and rewrite it with custom criteria however you’d like!",
    },
    {
        icon: "/proofreader.svg",
        title: "Proof Read",
        description: "Take any text and have it proofread, correcting grammar, spelling, punctuation and adding clarity.",
    },
    {
        icon: "/planner.svg",
        title: "Lesson Plan",
        description: "Generate a lesson plan for a topic or objective you’re teaching.",
    },
    {
        icon: "/report-card.svg",
        title: "Report Card",
        description: "Generate report card comments with a student's strengths and areas for growth.",
    },
    {
        icon: "/essay.png",
        title: "Essay Grader",
        description: "Grade Essay",
    },
    {
        icon: "/ppt.png",
        title: "PPT Generator",
        description: "Generate PPT",
    },
];

export default function ToolsShowcase() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 max-w-xs mx-auto">
            <div className="flex justify-center mb-4">
              <img src={tool.icon} alt={tool.title} className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">{tool.title}</h3>
            <p className="text-gray-600 text-center">{tool.description}</p>
          </div>
        ))}
      </div>
    );
}
