import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Khai báo hằng ngoài component để tránh khởi tạo lại
const choices = [
  { key: 'scissors', label: 'Scissors', img: '/images/icon-scissors.svg', border: 'border-yellow-400', pos: 0 },
  { key: 'paper', label: 'Paper', img: '/images/icon-paper.svg', border: 'border-blue-500', pos: 1 },
  { key: 'spock', label: 'Spock', img: '/images/icon-spock.svg', border: 'border-cyan-400', pos: 2 },
  { key: 'lizard', label: 'Lizard', img: '/images/icon-lizard.svg', border: 'border-purple-400', pos: 3 },
  { key: 'rock', label: 'Rock', img: '/images/icon-rock.svg', border: 'border-red-500', pos: 4 },
];

const winMap: Record<string, string[]> = {
  scissors: ['paper', 'lizard'],
  paper: ['rock', 'spock'],
  rock: ['lizard', 'scissors'],
  lizard: ['spock', 'paper'],
  spock: ['scissors', 'rock'],
};

function getResult(player: string, house: string) {
  if (player === house) return 'DRAW';
  if (winMap[player]?.includes(house)) return 'YOU WIN';
  return 'YOU LOSE';
}

function App() {
  const [score, setScore] = useState(12);
  const [stage, setStage] = useState<'pick' | 'result'>('pick');
  const [playerPick, setPlayerPick] = useState<string | null>(null);
  const [housePick, setHousePick] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  function handlePick(choice: string) {
    const house = choices[Math.floor(Math.random() * choices.length)].key;
    setPlayerPick(choice);
    setHousePick(house);
    const res = getResult(choice, house);
    setResult(res);
    setScore((prev) => {
      if (res === 'YOU WIN') return prev + 1;
      if (res === 'YOU LOSE' && prev > 0) return prev - 1;
      return prev;
    });
    setStage('result');
  }

  function handlePlayAgain() {
    setStage('pick');
    setPlayerPick(null);
    setHousePick(null);
    setResult('');
  }

  return (
    <div className="bg-gradient-to-br from-[#1f3756] to-[#141539] h-screen w-screen">
      <Card className="max-w-4xl mx-auto bg-transparent shadow-none border-none pt-4 md:pt-12 p-6">
        {/* Header: Logo + Score */}

        <div className="bg-transparent border-4 border-[#606e85] rounded-2xl md:rounded-3xl flex flex-row items-center justify-between p-6 md:p-6 max-w-full mx-auto size-full">
          <div className="flex flex-col justify-center">
            <span className="text-white font-extrabold text-lg md:text-2xl leading-tight tracking-widest uppercase whitespace-pre-line md:whitespace-pre-line" style={{ lineHeight: 1.1 }}>
              ROCK<br />PAPER<br />SCISSORS<br />LIZARD<br />SPOCK
            </span>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl flex flex-col items-center justify-center px-10 py-4 md:px-10 md:py-4 min-w-[80px] md:min-w-[120px] shadow-md ml-2 md:ml-8 h-full">
            <span className="text-xs md:text-sm text-blue-800 font-bold tracking-widest mb-1 md:mb-2">SCORE</span>
            <span className="text-4xl md:text-6xl font-bold text-gray-700 tracking-wide">{score}</span>
          </div>
        </div>


      </Card>
      {/* Game Choices - Pentagon Layout */}
      {stage === 'pick' && (
        <div className="relative flex justify-center items-center w-[340px] h-[340px] mx-auto mt-8 mb-12 select-none md:w-[500px] md:h-[500px] md:mt-20">
          {/* Pentagon background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 flex items-center justify-center px-12 md:px-0">
            <img src="/images/bg-pentagon.svg" alt="Pentagon" className="w-full h-full object-contain" />
          </div>
          {/* 5 buttons positioned absolutely in pentagon */}
          {choices.map((choice) => {

            let left = 0, top = 0;
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              // Desktop
              if (choice.key === 'scissors') { left = 250; top = 30; }
              if (choice.key === 'paper') { left = 20; top = 200; }
              if (choice.key === 'spock') { left = 110; top = 470; }
              if (choice.key === 'lizard') { left = 390; top = 470; }
              if (choice.key === 'rock') { left = 480; top = 200; }
            } else {
              // Mobile 375px - khớp ảnh mẫu
              if (choice.key === 'scissors') { left = 175; top = 60; }
              if (choice.key === 'paper') { left = 65; top = 135; }
              if (choice.key === 'rock') { left = 280; top = 135; }
              if (choice.key === 'spock') { left = 105; top = 260; }
              if (choice.key === 'lizard') { left = 240; top = 260; }
            }
            return (
              <Button
                key={choice.key}
                variant="outline"
                className={`absolute ${choice.border} rounded-full md:border-[12px] border-[8px] md:size-36 size-24 flex items-center justify-center shadow-lg hover:scale-105 transition z-10 bg-white -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
                style={{ left, top }}
                onClick={() => handlePick(choice.key)}
              >
                <img src={choice.img} alt={choice.label} className="md:size-20" />
              </Button>
            );
          })}
        </div>
      )}

      {/* Result Panel */}
      {stage === 'result' && playerPick && housePick && (
        <div className="flex flex-col items-center justify-center mt-8 mb-8 w-full">
          {/* 2 lựa chọn ngang */}
          <div className="flex flex-row items-end justify-center w-full gap-2 md:gap-20 mb-8">
            {/* Player pick */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center">
                {/* Hiệu ứng đồng tâm khi thắng */}
                {result === 'YOU WIN' && (
                  <>
                    <span className="absolute inline-flex h-[180px] w-[180px] rounded-full bg-white/20 animate-ping z-0" />
                    <span className="absolute inline-flex h-[120px] w-[120px] rounded-full bg-white/10 animate-ping z-0 delay-200" />
                    <span className="absolute inline-flex h-[80px] w-[80px] rounded-full bg-white/5 animate-ping z-0 delay-500" />
                  </>
                )}
                <div className={`relative rounded-full border-[12px] md:border-[18px] ${choices.find(c => c.key === playerPick)?.border} size-32 md:size-60 flex items-center justify-center shadow-2xl bg-white z-10`}>
                  <img src={choices.find(c => c.key === playerPick)?.img} alt={playerPick} className="size-14 md:size-30" />
                </div>
              </div>
              <span className="text-xs text-white mt-4 tracking-widest font-bold md:text-base">YOU PICKED</span>
            </div>
            {/* House pick */}
            <div className="flex flex-col items-center flex-1">
              <div className={`rounded-full border-[12px] md:border-[18px] ${choices.find(c => c.key === housePick)?.border} size-32 md:size-60 flex items-center justify-center shadow-2xl bg-white`}>
                <img src={choices.find(c => c.key === housePick)?.img} alt={housePick} className="size-14 md:size-30" />
              </div>
              <span className="text-xs text-white mt-4 tracking-widest font-bold md:text-base">THE HOUSE PICKED</span>
            </div>
          </div>
          {/* Kết quả + Play again */}
          <div className="flex flex-col items-center w-full mt-8">
            <span className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg tracking-widest text-center">{result}</span>
            <Button className="w-fit max-w-xs bg-white text-[#3b4262] font-bold rounded-md px-10 py-6 shadow-md hover:bg-blue-50 transition-all text-lg tracking-widest cursor-pointer" onClick={handlePlayAgain}>PLAY AGAIN</Button>
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="relative mx-auto mt-20 max-w-xs flex justify-center md:fixed md:right-10 md:bottom-10 md:left-auto md:mt-0 ">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-fit bg-transparent border-2 border-gray-300 text-white font-medium rounded-md md:px-10 px-8 py-5 shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all text-lg tracking-widest cursor-pointer"
            >
              RULES
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(
            "bg-white p-8 rounded-xl",
            "max-w-screen h-screen rounded-none md:rounded-xl"
          )} showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold mb-4">RULES</DialogTitle>
            </DialogHeader>
            <img src="/images/image-rules-bonus.svg" alt="Rules" className="mx-auto" />
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute left-1/2 -translate-x-1/2 bottom-8 size-12 p-0 bg-transparent border-none shadow-none hover:bg-gray-100 focus:outline-none
                  md:left-auto md:right-6 md:top-6 md:bottom-auto md:-translate-x-0 md:translate-y-0"
                aria-label="Close"
              >
                <img src="/images/icon-close.svg" alt="icon-close" className="size-6 text-gray-300" />
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
