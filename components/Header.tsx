// components/Header.tsx
import React from 'react';
import { GameMode, GAME_MODE_OPTIONS, GAME_SHORT_TITLES } from '../constants';

interface HeaderProps {
  currentGameMode: GameMode;
  onGameModeChange: (newMode: GameMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentGameMode, onGameModeChange }) => {
  return (
    <header className="py-3">
      <div className="flex flex-row justify-between items-center w-full mb-1 sm:mb-2"> {/* Reduced bottom margin */}
        {/* Title part */}
        <div className="flex-grow mr-2 sm:mr-3 overflow-hidden">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-pink-500 to-fuchsia-600 drop-shadow-md text-left whitespace-nowrap overflow-hidden text-ellipsis">
            {GAME_SHORT_TITLES[currentGameMode]}
          </h1>
        </div>
        {/* Selector part */}
        <div className="flex-shrink-0 w-auto min-w-[170px] sm:min-w-[180px]">
          <select
            id="gameModeSelector"
            value={currentGameMode}
            onChange={(e) => onGameModeChange(e.target.value as GameMode)}
            className="w-full p-2 sm:p-2.5 bg-white border border-sky-400 rounded-lg shadow-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-800 text-xs sm:text-sm appearance-none"
            aria-label="機種選択 (Select Game)"
          >
            {GAME_MODE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {/* This displays the full game name */}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* GAME_SUBTITLES paragraph removed */}
    </header>
  );
};