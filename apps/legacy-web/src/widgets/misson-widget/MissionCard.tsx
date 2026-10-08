import StartMissionButton from '@/features/mission/StartMissionButton';
import CompletedStampIcon from '@/shared/assets/icons/misson-completed.svg?react';
import Card from '@/shared/ui/card/_card';

import { getMissionUrl } from './get-mission-url';

export default function MissionCard({
  missionInfo,
  isCompleted,
  missionName,
}: {
  missionInfo: { missionDescription: string; awardXp: number };
  isCompleted: boolean;
  missionName: string;
}) {
  return (
    <Card className=" h-full w-2/3 min-h-[400px] flex flex-col justify-between p-5 ">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-[42px] leading-none">오늘의 미션🔥</h3>
        <hr className="text-gray-500 border-dashed border-2" />
        {isCompleted ? (
          <div className="w-full flex-grow flex items-center justify-center mt-2">
            <CompletedStampIcon />
          </div>
        ) : (
          <ul className="flex list-disc pl-5 leading-none">
            <li className="text-3xl font-medium">
              {missionInfo.missionDescription || '자료구조 챕터3 완료'}
              <small className="block text-2xl text-gray-800 font-normal mt-1">
                완료 시 {missionInfo.awardXp}xp
              </small>
            </li>
          </ul>
        )}
      </div>
      <StartMissionButton url={getMissionUrl(missionName)} isCompleted={isCompleted} />
    </Card>
  );
}
