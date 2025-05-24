
import { Mic, Users, FileText, BarChart3 } from "lucide-react";

const ExamTapeHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 academic-gradient rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ExamTape</h1>
                <p className="text-sm text-gray-500">Intelligent Samtaleanalyse</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Optagelse</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Scener</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Transskription</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Analyse</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ExamTapeHeader;
