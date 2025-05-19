type LoadingParams = {
  wrapperClassName?: string;
};

export default function Loading({ wrapperClassName }: LoadingParams) {
  return (
    <div className={`flex items-center justify-center ${wrapperClassName}`}>
      <div
        className="w-10 h-10 border-4 border-color-border border-t-4 border-t-primary rounded-full animate-spin">
      </div>
    </div>
  );
}