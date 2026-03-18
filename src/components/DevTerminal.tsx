import { useState, useEffect, useRef } from 'react';

export function DevTerminal() {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addLine = (line: string) => {
    setOutput(prev => [...prev, line]);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    addLine(`> ${trimmed}`);
    if (trimmed === 'whoami') {
      addLine('Claude Bot - Your friendly AI assistant');
    } else if (trimmed === 'clear') {
      setOutput([]);
    } else {
      addLine(`Command not found: ${trimmed}`);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // auto-scroll
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="dev-terminal bg-black/80 text-emerald-400 font-mono p-2 mt-8 max-h-48 overflow-auto" ref={containerRef}>
      {output.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="bg-transparent border-none outline-none text-emerald-400 w-full"
          placeholder="Type a command…"
        />
      </div>
    </div>
  );
}
