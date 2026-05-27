
// components/VersionHistoryModal.tsx
import React from 'react';
import type { VersionInfo } from '../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: VersionInfo[];
  currentVersion: string;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose, versions, currentVersion }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="version-history-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="version-history-title" className="text-lg sm:text-xl font-semibold text-sky-700">
            更新履歴
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="閉じる"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto custom-scroll flex-grow pr-1">
          {versions.length > 0 ? (
            versions.map((versionInfo, index) => (
              <div 
                key={versionInfo.version} 
                className={`mb-4 pb-3 ${index < versions.length - 1 ? 'border-b border-gray-200' : ''} ${versionInfo.version === currentVersion ? 'bg-sky-50 p-3 rounded-md' : 'p-2'}`}
              >
                <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                  Version {versionInfo.version}
                  {versionInfo.version === currentVersion && <span className="text-xs text-pink-500 ml-2">(現在)</span>}
                </h3>
                <p className="text-xs text-gray-500 mb-1.5">{versionInfo.date}</p>
                {versionInfo.changes.length > 0 ? (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-0.5">
                    {versionInfo.changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-600 italic">このバージョンの変更記録はありません。</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">利用可能なバージョン履歴はありません。</p>
          )}
        </div>
        <div className="mt-4 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-70 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
