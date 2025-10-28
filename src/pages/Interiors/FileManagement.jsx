import React, { useState } from 'react';
import { Plus, Folder, File, Trash2, Upload, X, Save, ChevronRight, FolderOpen } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import SidePannel from '../../components/common/SidePannel';

const FileManagement = () => {
  const [folders, setFolders] = useState([]);
  const [showAddFolderForm, setShowAddFolderForm] = useState(false);
  const [showAddFileForm, setShowAddFileForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [viewMode, setViewMode] = useState('folders');

  const [folderFormData, setFolderFormData] = useState({
    name: '',
    description: ''
  });

  const [fileFormData, setFileFormData] = useState({
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

  const handleFolderInputChange = (e) => {
    const { name, value } = e.target;
    setFolderFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileInputChange = (e) => {
    const { name, value } = e.target;
    setFileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileFormData(prev => ({
          ...prev,
          file: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFolder = () => {
    if (!folderFormData.name) {
      showMessage('Please enter folder name!');
      return;
    }

    const newFolder = {
      id: Date.now(),
      name: folderFormData.name,
      description: folderFormData.description,
      files: [],
      createdDate: new Date().toLocaleDateString()
    };

    setFolders([...folders, newFolder]);
    setFolderFormData({ name: '', description: '' });
    setShowAddFolderForm(false);
    showMessage('Folder created successfully!');
  };

  const handleAddFile = () => {
    if (!fileFormData.documentType || !fileFormData.file) {
      showMessage('Please select document type and attach a file!');
      return;
    }

    const newFile = {
      id: Date.now(),
      documentType: fileFormData.documentType,
      file: fileFormData.file,
      fileName: fileFormData.fileName,
      uploadDate: new Date().toLocaleDateString()
    };

    const updatedFolders = folders.map(folder => {
      if (folder.id === selectedFolder.id) {
        return { ...folder, files: [...folder.files, newFile] };
      }
      return folder;
    });

    setFolders(updatedFolders);

    const updatedFolder = updatedFolders.find(f => f.id === selectedFolder.id);
    setSelectedFolder(updatedFolder);

    setFileFormData({ documentType: '', file: null, fileName: '' });
    setShowAddFileForm(false);
    showMessage('File added successfully!');
  };

  const handleDeleteFolder = (id) => {
    if (window.confirm('Are you sure you want to delete this folder and all its files?')) {
      setFolders(folders.filter(folder => folder.id !== id));
      showMessage('Folder deleted successfully!');
    }
  };

  const handleDeleteFile = (folderId, fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const updatedFolders = folders.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, files: folder.files.filter(file => file.id !== fileId) };
        }
        return folder;
      });
      setFolders(updatedFolders);

      const updatedFolder = updatedFolders.find(f => f.id === folderId);
      setSelectedFolder(updatedFolder);

      showMessage('File deleted successfully!');
    }
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
    setViewMode('files');
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setViewMode('folders');
    setShowAddFileForm(false);
  };

  const handleCancelFolder = () => {
    setShowAddFolderForm(false);
    setFolderFormData({ name: '', description: '' });
  };

  const handleCancelFile = () => {
    setShowAddFileForm(false);
    setFileFormData({ documentType: '', file: null, fileName: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>

      <div className="mt-16 pl-16 md:pl-64 p-4 md:p-15 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8 text-center px-2 mt-6 sm:mt-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              E-Vault
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-700">
              {viewMode === 'folders' ? 'Store and manage your documents securely' : `Files in ${selectedFolder?.name}`}
            </p>
          </div>

          {saveMessage && (
            <div className="mb-4 p-3 md:p-4 bg-green-100 border-2 border-green-400 rounded-lg text-green-800 text-center font-medium text-xs sm:text-sm md:text-base mx-2">
              {saveMessage}
            </div>
          )}

          {viewMode === 'files' && (
            <div className="mb-4 px-2 flex items-center gap-2 text-sm md:text-base text-gray-600">
              <button onClick={handleBackToFolders} className="hover:text-black font-medium">
                Folders
              </button>
              <ChevronRight size={16} />
              <span className="text-black font-semibold">{selectedFolder?.name}</span>
            </div>
          )}

          {viewMode === 'folders' && !showAddFolderForm && (
            <div className="mb-6 px-2">
              <button
                onClick={() => setShowAddFolderForm(true)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 md:py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={24} />
                <span className="text-sm md:text-base">Create New Folder</span>
              </button>
            </div>
          )}

          {viewMode === 'files' && !showAddFileForm && (
            <div className="mb-6 px-2 flex gap-2">
              <button
                onClick={handleBackToFolders}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <X size={20} />
                <span className="text-sm md:text-base hidden sm:inline">Back</span>
              </button>
              <button
                onClick={() => setShowAddFileForm(true)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 md:py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={24} />
                <span className="text-sm md:text-base">Add File</span>
              </button>
            </div>
          )}

          {showAddFolderForm && (
            <div className="mb-6 p-4 md:p-6 bg-white border-2 border-amber-400 rounded-lg space-y-4 mx-2">
              <h3 className="text-lg md:text-xl font-bold text-black mb-4">Create New Folder</h3>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Folder Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={folderFormData.name}
                  onChange={handleFolderInputChange}
                  placeholder="Enter folder name"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={folderFormData.description}
                  onChange={handleFolderInputChange}
                  placeholder="Enter folder description"
                  rows="3"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white text-black"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddFolder}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors border-2 border-black"
                >
                  <Save size={16} className="md:w-5 md:h-5" />
                  Create Folder
                </button>
                <button
                  onClick={handleCancelFolder}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 md:py-3 px-3 md:px-6 rounded-lg border-2 border-black shadow-lg flex items-center justify-center transition-colors"
                >
                  <X size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          )}

          {showAddFileForm && (
            <div className="mb-6 p-4 md:p-6 bg-white border-2 border-amber-400 rounded-lg space-y-4 mx-2">
              <h3 className="text-lg md:text-xl font-bold text-black mb-4">Add File to {selectedFolder?.name}</h3>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black mb-1.5 md:mb-2">
                  Document Type *
                </label>
                <select
                  name="documentType"
                  value={fileFormData.documentType}
                  onChange={handleFileInputChange}
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
                  Attach File *
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
                      {fileFormData.fileName || 'Click to upload file'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      PDF, DOC, DOCX, JPG, PNG, XLSX supported
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddFile}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors border-2 border-black"
                >
                  <Save size={16} className="md:w-5 md:h-5" />
                  Save File
                </button>
                <button
                  onClick={handleCancelFile}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 md:py-3 px-3 md:px-6 rounded-lg border-2 border-black shadow-lg flex items-center justify-center transition-colors"
                >
                  <X size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'folders' && (
            <div className="space-y-4 px-2">
              {folders.length > 0 ? (
                folders.map(folder => (
                  <div
                    key={folder.id}
                    className="bg-white border-2 border-amber-400 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex items-start gap-3 md:gap-4 flex-1 cursor-pointer"
                        onClick={() => handleOpenFolder(folder)}
                      >
                        <div className="bg-amber-400 p-3 md:p-4 rounded-lg border-2 border-black flex-shrink-0">
                          <FolderOpen size={24} className="md:w-8 md:h-8 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-black text-sm md:text-lg mb-1 break-words">
                            {folder.name}
                          </h4>
                          {folder.description && (
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              {folder.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs md:text-sm bg-amber-200 px-3 py-1.5 rounded-lg border-2 border-amber-400 font-medium">
                              {folder.files.length} {folder.files.length === 1 ? 'file' : 'files'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {folder.createdDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="p-2 md:p-3 rounded-lg border-2 border-black flex-shrink-0"
                        title="Delete Folder"
                      >
                        <Trash2 size={18} className="text-black md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-16 bg-white rounded-lg border-2 border-amber-400">
                  <Folder size={48} className="md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
                    No folders created yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Click "Create New Folder" to get started
                  </p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'files' && selectedFolder && (
            <div className="space-y-4 px-2">
              {selectedFolder.files.length > 0 ? (
                selectedFolder.files.map(file => (
                  <div
                    key={file.id}
                    className="bg-white border-2 border-amber-400 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 md:gap-4 flex-1">
                        <div className="bg-amber-400 p-3 md:p-4 rounded-lg border-2 border-black flex-shrink-0">
                          <File size={24} className="md:w-8 md:h-8 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-black text-sm md:text-lg mb-2 break-words">
                            {file.fileName}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-amber-200 px-3 py-1.5 rounded-lg border-2 border-amber-400 font-medium">
                              <File size={14} />
                              {file.documentType}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            Uploaded: {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(selectedFolder.id, file.id)}
                        className="bg-red-400 hover:bg-red-500 p-2 md:p-3 rounded-lg border-2 border-black transition-colors flex-shrink-0"
                        title="Delete File"
                      >
                        <Trash2 size={18} className="md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-16 bg-white rounded-lg border-2 border-amber-400">
                  <File size={48} className="md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
                    No files in this folder yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Click "Add File" to upload documents
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagement;