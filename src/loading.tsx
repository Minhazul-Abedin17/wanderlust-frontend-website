import { LoaderCircle, Plane } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 dark:border-gray-800 dark:border-t-sky-400" />

        <Plane className="h-10 w-10 rotate-[-15deg] text-sky-600 dark:text-sky-400" />
      </div>

      <h2 className="mt-8 text-2xl font-bold tracking-tight">
        Preparing Your Journey
      </h2>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        Exploring amazing destinations for you...
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Please wait
      </div>
    </div>
  );
};

export default Loading;