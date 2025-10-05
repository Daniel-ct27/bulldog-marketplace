import { Calendar, Clock, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import {useState} from "react"
import { useNavigate } from 'react-router-dom';


const RequestHelpPage: React.FC = () => {
  const navigate = useNavigate();


  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDate, setTaskDate] = useState<string>('');
  const [taskTime, setTaskTime] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const handleSubmit = (): void => {
    const requestData = {
      taskTitle,
      taskDescription,
      taskDate,
      taskTime,
      category
    };
    console.log('Submitting help request:', requestData);
  };

  const handleBack = () => {
    console.log('Going back to account page');
   
    navigate("/account");

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 mb-8 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium tracking-wide">Back to Account</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
              REQUEST HELP
            </h1>
            <p className="text-xl text-slate-400 font-light tracking-wide">
              Describe your task and connect with skilled professionals
            </p>
          </div>

          {/* Request Form */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
            <div className="space-y-8">
              {/* Task Title */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Need help moving furniture"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium tracking-wide text-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium tracking-wide text-lg"
                >
                  <option value="" className="bg-slate-800">Select a category</option>
                  <option value="moving" className="bg-slate-800">Moving & Delivery</option>
                  <option value="repair" className="bg-slate-800">Home Repair</option>
                  <option value="cleaning" className="bg-slate-800">Cleaning</option>
                  <option value="tech" className="bg-slate-800">Tech Support</option>
                  <option value="tutoring" className="bg-slate-800">Tutoring</option>
                  <option value="other" className="bg-slate-800">Other</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date Needed
                  </label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium tracking-wide text-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Time Needed
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium tracking-wide text-lg"
                  />
                </div>
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  Task Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Provide detailed information about what you need help with..."
                  rows={6}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium tracking-wide text-lg resize-none"
                />
                <p className="mt-2 text-slate-500 text-sm">Be as detailed as possible to help professionals understand your needs</p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center space-x-3 px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]"
              >
                <Send className="w-6 h-6" />
                <span className="tracking-wide">SUBMIT REQUEST</span>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <p className="text-slate-400 text-center">
              💡 <span className="font-medium text-slate-300">Pro Tip:</span> Include photos, budget estimates, and specific requirements to attract the best professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHelpPage;