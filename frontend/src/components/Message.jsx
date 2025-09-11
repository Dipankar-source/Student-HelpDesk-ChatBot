import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

const Message = ({ message }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');
    const index = props['data-index'];
    
    return !inline && match ? (
      <div className="relative my-3 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-xs text-gray-200">
          <span>{match[1]}</span>
          <button 
            onClick={() => copyToClipboard(codeText, index)}
            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            {copiedCode === index ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          style={coldarkDark}
          language={match[1]}
          PreTag="div"
          className="text-sm"
          {...props}
        >
          {codeText}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className ? `${className} bg-gray-100 px-1 py-0.5 rounded text-sm` : ''} {...props}>
        {children}
      </code>
    );
  };

  const Link = ({ href, children }) => {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline font-medium"
      >
        {children}
      </a>
    );
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start space-x-2 max-w-xs lg:max-w-2xl ${
          message.sender === "user"
            ? "flex-row-reverse space-x-reverse"
            : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
            message.sender === "user"
              ? "bg-blue-600 text-white"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          }`}
        >
          {message.sender === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <img className="h-full w-full object-cover" src="./help.png" alt="bot" />
          )}
        </div>
        <div
          className={`px-4 py-3 rounded-2xl ${
            message.sender === "user"
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-200"
          }`}
        >
          {message.sender === "bot" ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const index = Math.random().toString(36).substring(7);
                    return (
                      <CodeBlock 
                        node={node} 
                        inline={inline} 
                        className={className} 
                        data-index={index}
                        {...props}
                      >
                        {children}
                      </CodeBlock>
                    );
                  },
                  a: Link,
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full divide-y divide-gray-200">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          )}
          <p
            className={`text-xs mt-2 ${
              message.sender === "user"
                ? "text-blue-200"
                : "text-slate-500"
            }`}
          >
            {message.timestamp?.toDate
              ? message.timestamp
                  .toDate()
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
              : new Date(message.timestamp).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;