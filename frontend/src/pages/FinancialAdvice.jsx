import React from "react";
import {
  FaRobot,
  FaChartLine,
  FaLightbulb,
  FaStar,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const FinancialAdvice = ({ summary }) => {
  if (!summary) return null;

  const { insights, suggestions, aiAdvice } = summary;

  // Parse AI advice from string format to array (split by bullet points)
  const parseAiAdvice = (advice) => {
    if (!advice) return [];

    // Split by bullet points or new lines with dash
    return advice
      .split(/\n-|\n•/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const aiAdvicePoints = parseAiAdvice(aiAdvice);
  console.log("aiAdvicePoints",aiAdvicePoints)
  console.log("summary",summary)
  console.log("aiAdvice",aiAdvice)

  return (
    <div className="space-y-6">
      {/* AI Financial Advice Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-sm p-6 border border-blue-100 dark:border-blue-800/50">
        <div className="flex items-center mb-4">
          <FaRobot className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Financial Advice
          </h2>
        </div>

        <div className="space-y-4 mt-4">
          {aiAdvicePoints.length > 0 ? (
            aiAdvicePoints.map((advice, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-800 dark:text-gray-200"
                      dangerouslySetInnerHTML={{ __html: advice }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                AI advice is being generated...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insights and Suggestions in a two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insights Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaChartLine className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Financial Insights
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
          </div>

          <div className="space-y-3">
            {insights && insights.length > 0 ? (
              insights.map((data, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                      <FaInfoCircle className="w-3.5 h-3.5" />
                    </span>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {data}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No insights available at the moment
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaLightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Suggestions
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded" />
          </div>

          <div className="space-y-3">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((data, index) => (
                <div
                  key={index}
                  className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-amber-500/10 text-amber-500 rounded-full text-sm font-semibold">
                      <FaStar className="w-3.5 h-3.5" />
                    </span>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {data}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No suggestions available at this time
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAdvice;
