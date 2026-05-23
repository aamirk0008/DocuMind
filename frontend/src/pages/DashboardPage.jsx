import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Trash2, MessageSquare, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useDocuments, useUploadDocument, useDeleteDocument } from '../hooks/useDocuments';

const StatusBadge = ({ status }) => {
  const map = {
    ready:      { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Ready' },
    processing: { icon: Loader2,     color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Processing' },
    pending:    { icon: Clock,       color: 'text-blue-500',  bg: 'bg-blue-500/10',  label: 'Pending' },
    failed:     { icon: XCircle,     color: 'text-destructive', bg: 'bg-destructive/10', label: 'Failed' },
  };
  const { icon: Icon, color, bg, label } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${bg} ${color}`}>
      <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: documents = [], isLoading } = useDocuments();
  const upload = useUploadDocument();
  const remove = useDeleteDocument();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || file.type !== 'application/pdf') return;
    upload.mutate(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
          <p className="text-muted-foreground mt-1">Upload PDFs and chat with them using AI</p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors mb-8 cursor-pointer
            ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <Upload className={`h-10 w-10 mx-auto mb-3 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm font-medium text-foreground">
            {upload.isPending ? 'Uploading...' : 'Drop a PDF here or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF only · Max 20MB</p>
        </div>

        {/* Document list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No documents yet — upload your first PDF</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <Card key={doc._id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatSize(doc.size)} · {doc.chunkCount} chunks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={doc.status} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/chat/${doc._id}`)}
                    disabled={doc.status !== 'ready'}
                    title="Chat with document"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove.mutate(doc._id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}