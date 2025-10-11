import React, { useState } from 'react';
import { Plus, Folder, File, Trash2, Upload, X, Save, Vault } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SidePannel from '../components/common/SidePannel';
const FileManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    folderName: '',
    documentType: '',
    file: null,
    fileName: ''
  });

  const documentTypes = [
    'Contract',
    'Invoice',
    'Blueprint',
    'Report',
    'Certificate',
    'Permit',
    'Other'
  ];

  const showMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          file: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!formData.folderName || !formData.documentType || !formData.file) {
      showMessage('Please fill all fields and attach a document!');
      return;
    }

    const newDocument = {
      id: Date.now(),
      folderName: formData.folderName,
      documentType: formData.documentType,
      file: formData.file,
      fileName: formData.fileName,
      uploadDate: new Date().toLocaleDateString()
    };

    setDocuments([...documents, newDocument]);
    setFormData({ folderName: '', documentType: '', file: null, fileName: '' });
    setShowAddForm(false);
    showMessage('Document added successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      showMessage('Document deleted successfully!');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ folderName: '', documentType: '', file: null, fileName: '' });
  };

  return (
 <div className="min-h-screen bg-gray-50">
         {/* Navbar */}
      <nav className="bg-amber-400 border-b-4 border-black fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar/>
      </nav>

      {/* Side Panel */}
      <aside className="bg-amber-100 border-r-4 border-black fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel/>
      </aside>
  
      {/* Main Content */}
      <div className="mt-25 w-full p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8 text-center px-2 mt-6 sm:mt-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              E-Vault
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-700">
              Store and manage your documents securely
            </p>
          </div>

          {saveMessage && (
            <div className="mb-4 p-3 md:p-4 bg-green-100 border-2 border-green-400 rounded-lg text-green-800 text-center font-medium text-xs sm:text-sm md:text-base mx-2">
              {saveMessage}
            </div>
          )}

          {/* Add Button */}
          {!showAddForm && (
            <div className="mb-6 px-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 md:py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={24} />
                <span className="text-sm md:text-base">Add New Document</span>
              </button>
            </div>
          )}

          {/* Add Document Form */}
          {showAddForm && (
            <div className="mb-6 p-4 md:p-6 bg-white border-2 border-amber-400 rounded-lg space-y-4 mx-2">
              <h3 className="text-lg md:text-xl font-bold text-black mb-4">Add New Document</h3>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  name="folderName"
                  value={formData.folderName}
                  onChange={handleInputChange}
                  placeholder="Enter folder name"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Document Type
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-black"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Attach Document
                </label>
                <div className="border-2 border-dashed border-amber-400 rounded-lg p-6 md:p-8 text-center bg-amber-50">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={40} className="mx-auto text-amber-600 mb-2" />
                    <p className="text-sm md:text-base font-medium text-black">
                      {formData.fileName || 'Click to upload document'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      PDF, DOC, DOCX, JPG, PNG, XLSX supported
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors border-2 border-black"
                >
                  <Save size={16} className="md:w-5 md:h-5" />
                  Save Document
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 md:py-3 px-3 md:px-6 rounded-lg border-2 border-black shadow-lg flex items-center justify-center transition-colors"
                >
                  <X size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-4 px-2">
            {documents.length > 0 ? (
              documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="bg-white border-2 border-amber-400 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      <div className="bg-amber-400 p-3 md:p-4 rounded-lg border-2 border-black flex-shrink-0">
                        <File size={24} className="md:w-8 md:h-8 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-black text-sm md:text-lg mb-2 break-words">
                          {doc.fileName}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-amber-200 px-3 py-1.5 rounded-lg border-2 border-amber-400 font-medium">
                            <Folder size={14} />
                            {doc.folderName}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-amber-200 px-3 py-1.5 rounded-lg border-2 border-amber-400 font-medium">
                            <File size={14} />
                            {doc.documentType}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">
                          Uploaded: {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="bg-red-400 hover:bg-red-500 p-2 md:p-3 rounded-lg border-2 border-black transition-colors flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 md:py-16 bg-white rounded-lg border-2 border-amber-400">
                <Folder size={48} className="md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
                  No documents in vault yet
                </p>
                <p className="text-sm text-gray-500">
                  Click "Add New Document" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagement;