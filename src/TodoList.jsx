import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Bot,
} from "lucide-react";

// ✅ Gemini API setup
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  // ✅ Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const getAISuggestion = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const taskList = tasks.map((t, i) => `${i + 1}. ${t.text}`).join("\n");
      const prompt = `
        Here are my current tasks:
        ${taskList || "No tasks yet."}
        
        Based on this list, suggest 2-3 related tasks or productivity tips.
        Keep them short and practical.
      `;
      const result = await model.generateContent(prompt);
      setAiSuggestion(result.response.text());
    } catch {
      setAiSuggestion("⚠️ Failed to fetch AI suggestion. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 transition-colors bg-gray-100 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-lg mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📝 AI To-Do List
        </h1>
      </div>

      {/* Input */}
      <div className="flex w-full max-w-lg mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 rounded-l-lg border bg-white border-gray-300 text-black"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded-r-lg flex items-center gap-1 hover:bg-blue-600"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Task List */}
      <ul className="w-full max-w-lg space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 rounded-lg shadow bg-white"
          >
            <button
              onClick={() => toggleTask(index)}
              className="flex items-center gap-2"
            >
              {task.completed ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <Circle className="text-gray-400" />
              )}
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.text}
              </span>
            </button>
            <button
              onClick={() => deleteTask(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {/* AI Suggestion */}
      <div className="w-full max-w-lg mt-6">
        <button
          onClick={getAISuggestion}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600"
        >
          <Bot size={18} /> Get AI Help
        </button>
        {aiSuggestion && (
          <div className="mt-3 p-3 rounded-lg shadow text-sm bg-white text-gray-800">
            <strong>🤖 AI Suggestion:</strong>
            <div className="mt-1 whitespace-pre-line">{aiSuggestion}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
