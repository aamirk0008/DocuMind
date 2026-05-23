import { cn } from '../../lib/utils';

export default function Input({ className, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 text-sm',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 ring-primary transition',
          'disabled:opacity-50',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}