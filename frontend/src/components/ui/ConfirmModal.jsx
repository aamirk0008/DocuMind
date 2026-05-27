import { Trash2, X } from 'lucide-react';
import Button from './Button';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 cursor-pointer">
          <Trash2 className="h-5 w-5 text-destructive" />
        </div>

        <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer "
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}