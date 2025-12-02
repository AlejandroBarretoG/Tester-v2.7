import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play } from 'lucide-react';

// Configuración del tablero
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Hacia arriba
const GAME_SPEED = 150;

export default function RetroSnake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake_highscore') || '0'));

  // Referencia para el loop del juego (evita problemas de cierre con setInterval)
  const gameLoopRef = useRef<any>(null);

  // --- LÓGICA DEL JUEGO ---

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood(generateFood());
  };

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y
      };

      // 1. Detección de Colisiones (Paredes)
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // 2. Detección de Colisiones (Consigo mismo)
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 3. Comer Manzana
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood());
        // No removemos la cola, así crece
      } else {
        newSnake.pop(); // Removemos la cola para mantener el tamaño si no comió
      }

      return newSnake;
    });
  }, [direction, food, gameOver, highScore, generateFood]);

  // Game Loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, moveSnake]);

  // Controles de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // --- RENDERIZADO ---

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 max-w-lg mx-auto">
      
      {/* Header Stats */}
      <div className="w-full flex justify-between items-center mb-4 text-white">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-green-500/20 rounded-lg text-green-400 font-bold text-xl">
             {score}
           </div>
           <span className="text-xs text-slate-400 uppercase font-bold">Puntos</span>
        </div>
        <div className="flex items-center gap-2">
           <Trophy size={16} className="text-yellow-500" />
           <span className="text-yellow-500 font-mono font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black border-2 border-slate-700 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.1)]"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '100%',
          aspectRatio: '1/1'
        }}
      >
        {/* Renderizado de Celdas (Manzana y Serpiente) */}
        {/* Nota: En un juego real complejo usaríamos Canvas, pero para Snake grid va bien */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div key={i} className={`
              w-full h-full border border-white/5
              ${isSnakeHead ? 'bg-green-400 rounded-sm z-10' : ''}
              ${isSnakeBody ? 'bg-green-600/80 rounded-sm' : ''}
              ${isFood ? 'bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]' : ''}
            `} />
          );
        })}

        {/* Overlay Pantalla de Inicio / Game Over */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in">
             <h2 className={`text-4xl font-black mb-2 ${gameOver ? 'text-red-500' : 'text-white'}`}>
               {gameOver ? 'GAME OVER' : 'SNAKE'}
             </h2>
             {gameOver && <p className="text-slate-300 mb-6">Puntuación Final: {score}</p>}
             
             <button 
               onClick={resetGame}
               className="group flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)]"
             >
               {gameOver ? <RefreshCw size={20} className="group-hover:rotate-180 transition-transform" /> : <Play size={20} fill="currentColor" />}
               {gameOver ? 'Intentar de Nuevo' : 'Jugar Ahora'}
             </button>
          </div>
        )}
      </div>

      {/* Mobile Controls (Visible solo en pantallas touch si se desea, aquí siempre visibles para demo) */}
      <div className="mt-6 grid grid-cols-3 gap-2 w-48">
        <div />
        <button className="p-4 bg-slate-800 rounded-lg text-slate-300 active:bg-slate-700 active:scale-95" onClick={() => direction.y === 0 && setDirection({x:0, y:-1})}><ArrowUp /></button>
        <div />
        <button className="p-4 bg-slate-800 rounded-lg text-slate-300 active:bg-slate-700 active:scale-95" onClick={() => direction.x === 0 && setDirection({x:-1, y:0})}><ArrowLeft /></button>
        <button className="p-4 bg-slate-800 rounded-lg text-slate-300 active:bg-slate-700 active:scale-95" onClick={() => direction.y === 0 && setDirection({x:0, y:1})}><ArrowDown /></button>
        <button className="p-4 bg-slate-800 rounded-lg text-slate-300 active:bg-slate-700 active:scale-95" onClick={() => direction.x === 0 && setDirection({x:1, y:0})}><ArrowRight /></button>
      </div>
      
      <p className="mt-4 text-xs text-slate-500 font-mono">
        Usa las flechas del teclado o los botones en pantalla.
      </p>
    </div>
  );
}