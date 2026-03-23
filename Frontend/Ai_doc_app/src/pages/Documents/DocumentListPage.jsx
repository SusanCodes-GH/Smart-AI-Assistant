import React, {useState, useEffect} from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'

import documentService from '../../services/documentService'
import styles from './document.module.css'
import Button from '../../components/common/Button'
import DocumentCard from '../../components/documents/DocumentCard'


const DocumentListPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploading, setUploading] = useState(false)

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data)
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      )
    }

    if (documents.length === 0) {
      return (
        <div className={styles.cntr}>
          <div className={styles.emp_box}>

            <div className={styles.lgo}>
              <FileText className='' strokeWidth={1.5} />
            </div>
            <div>
              <h3>No Documents Yet</h3>
              <p>Get started by uploading your first PDF document to begin learning.</p>
            </div>
            <div style={{textAlign : "center"}}>
              <button class={styles.upd} onClick={() => setIsUploadModalOpen(true)}><Plus strokeWidth={2.5} /> Upload Document</button>
            </div>

          </div>
        </div>
      )
    }

    return (
      <div className={styles.doc_grid}>
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.doc_header}>
        <div>
          <h2>My Documents</h2>
          <p>Manage and organize your learning materials</p>
        </div>

        { documents.length > 0 && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className='' strokeWidth={2.5} />
            Upload Document
          </Button>
        ) }
      </div>

      {renderContent()}

      

      {isUploadModalOpen && (
        <div className={styles.modal_overlay}>

          <div className={`${styles.modal_box} ${styles.upload_modal}`}>

            <button 
              className={styles.close_btn}
              onClick={() => setIsUploadModalOpen(false)} >
                <X strokeWidth={2} />
            </button>

            <h3>Upload New Document</h3>
            <p className={styles.modal_subtitle}>Add a PDF document to your library</p>
            
            <form onSubmit={handleUpload} > 

              <div>
                <label>Document Title</label>
                <input
                  type='text'
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  placeholder='e.g., React Guide Book'
                />
              </div> 

              <div>
                <label>PDF File</label>
                <div className={styles.file_drop}>
                  <input
                    id='file-upload'
                    type="file"  
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className={styles.upload_btn} style={{marginBottom:"12px"}}>
                    <Upload strokeWidth={2} />
                  </div>
                  <p>
                    {uploadFile ? (
                      <>{uploadFile.name}</>
                    ) : (
                      <><span style={{color: "#21c17a"}}>Click to upload</span> or drag and drop</>
                    )}
                  </p>
                  <p>PDF up to 10MB</p>
                </div>
              </div>

              <div className={styles.modal_actions}>
                <button 
                  className={`${styles.btn} ${styles.cancel}`}
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  className={`${styles.btn} ${styles.upload}`}
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_box}>
            <button 
              className={styles.close_btn}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X strokeWidth={2} />
            </button>

            <div className={`${styles.modal_icon} ${styles.danger}`}>
              <Trash2 strokeWidth={2} />
            </div>

            <h3>Confirm Deletion</h3>

            <p className={styles.modal_text}>
              Are you sure you want to delete the document: 
              <strong>{" "}{selectedDoc?.title}</strong>? This action cannot be undone.
            </p>

            <div className={styles.modal_actions}>
              <button 
                className={`${styles.btn} ${styles.cancel}`}
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
              > 
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.delete}`}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>


  )
}

export default DocumentListPage