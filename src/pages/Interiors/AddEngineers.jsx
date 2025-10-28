import React, { useEffect, useState } from 'react'
import { Search, Edit, Trash2, Phone, MapPin, User, X, Camera, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import SidePannel from '../../components/common/SidePannel'



// Mock API functions - replace with your actual API service
const getAllEngineers = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('No authentication token found')
  }
  
  const response = await fetch('http://localhost:5000/api/engineers', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    if (response.status === 401) {
      throw { error: 'Session expired. Please login again.' }
    }
    throw new Error('Failed to fetch engineers')
  }
  
  return await response.json()
}

const createEngineer = async (engineerData) => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('No authentication token found')
  }
  
  const formData = new FormData()
  formData.append('name', engineerData.name)
  formData.append('phone', engineerData.phone)
  formData.append('alternatePhone', engineerData.alternatePhone)
  formData.append('empId', engineerData.empId)
  formData.append('address', engineerData.address)
  if (engineerData.profileImage) {
    formData.append('profileImage', engineerData.profileImage)
  }
  
  const response = await fetch('http://localhost:5000/api/engineers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  
  return await response.json()
}

const deleteEngineer = async (id) => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('No authentication token found')
  }
  
  const response = await fetch(`http://localhost:5000/api/engineers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  
  return await response.json()
}

const AddEngineers = () => {
  const navigate = useNavigate()
  const [engineers, setEngineers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEngineer, setSelectedEngineer] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Add Engineer Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    empId: '',
    address: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch engineers function
  const fetchEngineers = async () => {
    console.log('Fetching engineers...')
    setIsLoading(true)
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('No token found, user not logged in')
      setEngineers([])
      setIsLoading(false)
      return
    }
    
    try {
      const response = await getAllEngineers()
      console.log('API Response:', response)
      
      if (response && response.success && response.engineers) {
        console.log('Engineers data:', response.engineers)
        setEngineers(response.engineers)
      } else {
        console.log('Response not successful, clearing engineers')
        setEngineers([])
      }
    } catch (error) {
      console.error('Error fetching engineers:', error)
      
      // Only redirect if session expired
      if (error.error === 'Session expired. Please login again.' || 
          error.message === 'Session expired. Please login again.' ||
          error.error === 'Unauthorized' ||
          error.message === 'Unauthorized') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        console.log('Setting empty engineers array due to error')
        setEngineers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEngineers()
  }, [])

  // Filter engineers based on search
  const filteredEngineers = engineers.filter(engineer =>
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.phone.includes(searchTerm)
  )

  const handleDelete = async (id) => {
    try {
      const response = await deleteEngineer(id)
      if (response.success) {
        await fetchEngineers()
        setShowDeleteModal(false)
        setSelectedEngineer(null)
        alert('Engineer deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting engineer:', error)
      alert(error.error || 'Failed to delete engineer')
    }
  }

  const handleEdit = (engineer) => {
    console.log('Edit engineer:', engineer)
    alert(`Edit functionality for ${engineer.name}`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }))
        return
      }
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (formData.alternatePhone.trim() && !/^\d{10}$/.test(formData.alternatePhone.trim())) {
      newErrors.alternatePhone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const engineerData = {
        name: formData.name,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        empId: formData.empId,
        address: formData.address,
        profileImage: profileImage
      }
      
      const response = await createEngineer(engineerData)
      
      if (response.success) {
        await fetchEngineers()
        
        setFormData({
          name: '',
          phone: '',
          alternatePhone: '',
          empId: '',
          address: ''
        })
        setProfileImage(null)
        setImagePreview(null)
        setErrors({})
        setShowAddModal(false)
        
        alert('Engineer added successfully!')
      }
    } catch (error) {
      console.error('Error creating engineer:', error)
      alert(error.error || 'Failed to add engineer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setFormData({
      name: '',
      phone: '',
      alternatePhone: '',
      empId: '',
      address: ''
    })
    setProfileImage(null)
    setImagePreview(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar/>
      </nav>

      <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>

      <div className="pt-25 pl-16 md:pl-64 pr-4 pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Engineers List</h2>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Loading...' : `Total Engineers: ${filteredEngineers.length}`}
                </p>
              </div>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-black rounded-lg transition-colors"
                style={{ backgroundColor: '#ffbe2a' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e6ab25'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffbe2a'}
              >
                <User className="w-4 h-4" />
                Add Engineer
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading engineers...</p>
            </div>
          )}

          {/* Desktop Table View */}
          {!isLoading && (
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engineer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEngineers.map((engineer) => (
                      <tr key={engineer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {engineer.profileImage ? (
                                <img src={engineer.profileImage} alt={engineer.name} className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <span className="text-blue-600 font-semibold">
                                  {engineer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{engineer.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{engineer.empId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{engineer.phone}</div>
                          {engineer.alternatePhone && (
                            <div className="text-sm text-gray-500">{engineer.alternatePhone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{engineer.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(engineer)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEngineer(engineer)
                                setShowDeleteModal(true)
                              }}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEngineers.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No engineers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new engineer.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mobile/Tablet Card View */}
          {!isLoading && (
            <div className="lg:hidden space-y-4">
              {filteredEngineers.map((engineer) => (
                <div key={engineer.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        {engineer.profileImage ? (
                          <img src={engineer.profileImage} alt={engineer.name} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-blue-600 font-semibold text-lg">
                            {engineer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{engineer.name}</h3>
                        <p className="text-sm text-gray-500">{engineer.empId}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(engineer)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEngineer(engineer)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900">{engineer.phone}</p>
                        {engineer.alternatePhone && (
                          <p className="text-sm text-gray-500">{engineer.alternatePhone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{engineer.address}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEngineers.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No engineers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new engineer.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Engineer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Add New Engineer</h3>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Upload profile picture (Max 5MB)</p>
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="10-digit number"
                        maxLength="10"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="10-digit number (optional)"
                        maxLength="10"
                      />
                    </div>
                    {errors.alternatePhone && <p className="text-red-500 text-sm mt-1">{errors.alternatePhone}</p>}
                  </div>

                  {/* Employee ID */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="empId"
                        value={formData.empId}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.empId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter employee ID"
                      />
                    </div>
                    {errors.empId && <p className="text-red-500 text-sm mt-1">{errors.empId}</p>}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="4"
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter complete address"
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding Engineer...' : 'Add Engineer'}
              </button>
              <button
                type="button"
                onClick={closeAddModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Engineer</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedEngineer.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(selectedEngineer.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedEngineer(null)
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddEngineers