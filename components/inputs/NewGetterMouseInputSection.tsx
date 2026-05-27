// components/inputs/NewGetterMouseInputSection.tsx
import React, { useState } from 'react';
import type { NewGetterMouseInput } from '../../types';
import { CompactNumberInput } from '../common/CompactNumberInput';

interface NewGetterMouseInputSectionProps {
  inputs: NewGetterMouseInput;
  onInputChange: (field: keyof NewGetterMouseInput, value: any) => void;
}

export const NewGetterMouseInputSection: React.FC<NewGetterMouseInputSectionProps> = ({
  inputs,
  onInputChange,
}) => {
  const [showStartInputs, setShowStartInputs] = useState(false);
  const commonLabelClass = "text-[10px] sm:text-xs font-medium text-gray-700 mr-0.5 whitespace-nowrap";
  const sectionTitleClass = "text-sm font-medium text-gray-700";
  const cardContentClassBase = "p-2 rounded-md shadow-sm border border-gray-200 bg-white";

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
           <h4 className={`${sectionTitleClass}`}>
            開始時のデータ
          </h4>
          <button onClick={() => setShowStartInputs(!showStartInputs)} className="ml-2 text-xs px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400" aria-expanded={showStartInputs} aria-controls="ngm-start-inputs">
            {showStartInputs ? '閉じる' : '入力'}
          </button>
        </div>
        {showStartInputs && (
          <div id="ngm-start-inputs" className={cardContentClassBase}>
            <div className="flex items-center justify-start space-x-1 flex-wrap gap-y-1">
              <CompactNumberInput id="startTotalGames" visualLabel="G数" value={inputs.startTotalGames} onChange={(val) => onInputChange('startTotalGames', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} min={0}/>
              <CompactNumberInput id="startBigCount" visualLabel="BIG" value={inputs.startBigCount} onChange={(val) => onInputChange('startBigCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
              <CompactNumberInput id="startRegCount" visualLabel="REG" value={inputs.startRegCount} onChange={(val) => onInputChange('startRegCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className={`${sectionTitleClass} mb-1`}>現在のデータ</h4>
        <div className={cardContentClassBase}>
          <div className="flex items-center justify-start space-x-1 flex-wrap gap-y-1">
            <CompactNumberInput id="currentTotalGames" visualLabel="G数" value={inputs.currentTotalGames} onChange={(val) => onInputChange('currentTotalGames', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} min={0}/>
            <CompactNumberInput id="currentBigCount" visualLabel="BIG" value={inputs.currentBigCount} onChange={(val) => onInputChange('currentBigCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
            <CompactNumberInput id="currentRegCount" visualLabel="REG" value={inputs.currentRegCount} onChange={(val) => onInputChange('currentRegCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
            <CompactNumberInput id="currentNetMedals" visualLabel="差枚" value={inputs.currentNetMedals} onChange={(val) => onInputChange('currentNetMedals', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} inputMode="text" />
          </div>
        </div>
      </div>

      <div>
        <h4 className={`${sectionTitleClass} mb-1`}>小役</h4>
        <div className={`${cardContentClassBase} flex flex-wrap items-center justify-start gap-x-2 gap-y-2`}>
            <CompactNumberInput id="orangeACount" visualLabel="🍊A" value={inputs.orangeACount} onChange={(val) => onInputChange('orangeACount', val)} min={0} inputClassName="w-10 sm:w-12" labelClassName={commonLabelClass}/>
            <CompactNumberInput id="orangeBCount" visualLabel="🍊B" value={inputs.orangeBCount} onChange={(val) => onInputChange('orangeBCount', val)} min={0} inputClassName="w-10 sm:w-12" labelClassName={commonLabelClass}/>
            <CompactNumberInput id="suikaCount" visualLabel="🍉" value={inputs.suikaCount} onChange={(val) => onInputChange('suikaCount', val)} min={0} inputClassName="w-10 sm:w-12" labelClassName={commonLabelClass}/>
            <CompactNumberInput id="cherryCount" visualLabel="🍒" value={inputs.cherryCount} onChange={(val) => onInputChange('cherryCount', val)} min={0} inputClassName="w-10 sm:w-12" labelClassName={commonLabelClass}/>
        </div>
      </div>

      <div>
        <h4 className={`${sectionTitleClass} mb-1`}>ボーナス中</h4>
        <div className={`${cardContentClassBase} flex flex-wrap items-center justify-start gap-x-2 gap-y-2`}>
           <CompactNumberInput id="bonusDiagonalOrangeCount" visualLabel="斜め🍊" value={inputs.bonusDiagonalOrangeCount} onChange={(val) => onInputChange('bonusDiagonalOrangeCount', val)} min={0} inputClassName="w-10"/>
           <div className="flex items-center">
              <label htmlFor="bonusIchiroCount" className={`${commonLabelClass}`}>イチロー</label>
              <CompactNumberInput id="bonusIchiroCount" visualLabel="" value={inputs.bonusIchiroCount} onChange={(val) => onInputChange('bonusIchiroCount', val)} placeholder="0" inputClassName="w-8" labelClassName="sr-only" min={0}/>
              <span className="mx-0.5 text-gray-600">/</span>
              <CompactNumberInput id="bonusIchiroOpportunityCount" visualLabel="" value={inputs.bonusIchiroOpportunityCount} onChange={(val) => onInputChange('bonusIchiroOpportunityCount', val)} placeholder="機会" inputClassName="w-12" labelClassName="sr-only" min={0}/>
            </div>
           <CompactNumberInput id="bonusHazukiCount" visualLabel="葉月" value={inputs.bonusHazukiCount} onChange={(val) => onInputChange('bonusHazukiCount', val)} min={0} inputClassName="w-10"/>
        </div>
      </div>

      <div>
        <h4 className={`${sectionTitleClass} mb-1`}>ボーナス当選契機</h4>
        <div className={`${cardContentClassBase} flex flex-wrap items-center justify-start gap-x-2 gap-y-2`}>
          <CompactNumberInput id="triggerRed7ReplayCount" visualLabel="赤7+リ" value={inputs.triggerRed7ReplayCount} onChange={(val) => onInputChange('triggerRed7ReplayCount', val)} min={0} inputClassName="w-10"/>
          <CompactNumberInput id="triggerNezumiOrangeACount" visualLabel="🐭+🍊A" value={inputs.triggerNezumiOrangeACount} onChange={(val) => onInputChange('triggerNezumiOrangeACount', val)} min={0} inputClassName="w-10"/>
          <CompactNumberInput id="triggerNezumiRichimeCCount" visualLabel="🐭+C" value={inputs.triggerNezumiRichimeCCount} onChange={(val) => onInputChange('triggerNezumiRichimeCCount', val)} min={0} inputClassName="w-10"/>
          <CompactNumberInput id="triggerBarRichimeCCount" visualLabel="BR+C" value={inputs.triggerBarRichimeCCount} onChange={(val) => onInputChange('triggerBarRichimeCCount', val)} min={0} inputClassName="w-10"/>
        </div>
      </div>
    </div>
  );
};
NewGetterMouseInputSection.displayName = 'NewGetterMouseInputSection';