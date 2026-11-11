export interface UploadedDocument {
  id: string;
  userId: string;
  filename: string;
  fileType: "pdf" | "docx" | "txt" | "md";
  fileSize: number;
  totalPages: number;
  summary?: string;
  extractedConcepts: string[];
  uploadedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  pageNumber: number;
  chunkIndex: number;
}
