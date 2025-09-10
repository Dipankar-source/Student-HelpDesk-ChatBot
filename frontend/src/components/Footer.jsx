import { Bot, Shield, Zap, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">BrainuBot</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Powered by Google Gemini AI technology to help students succeed
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure & Private</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Instant Response</span>
            </span>
            <span className="flex items-center space-x-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Multilingual Support</span>
            </span>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
            © 2025 University Help Desk. All rights reserved. | Privacy Policy
            | Terms of Service
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;