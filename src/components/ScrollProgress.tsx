export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const onScroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setProgress((winScroll / height) * 100);
  };
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50">
      <div className="h-full transition-all" style={{ width: `${progress}%` }} />
    </div>
  );
};
