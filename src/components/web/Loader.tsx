const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="size-80 border-2 border-muted-foreground border-y-0 animate-spin rounded-full" />
      <span className="absolute font-semibold text-muted-foreground">
        Loading {text}...
      </span>
    </div>
  );
};

export default Loader;
