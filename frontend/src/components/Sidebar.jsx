import { GraduationCap, Phone, Mail, Clock } from "lucide-react";

const Sidebar = ({
  stats,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="lg:col-span-1 space-y-6 hidden md:block">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Welcome to BrainuBot
          </h2>
          <p className="text-slate-600">
            Your 24/7 AI-powered student assistant
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-3 bg-slate-50 rounded-lg"
            >
              <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Need Human Help?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-slate-600">
            <Phone className="w-5 h-5 text-blue-600" />
            <span>070031 62601</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>info@brainwareuniversity.ac.in.</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Mon-Fri 8AM-6PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
