import React, { useState, useEffect } from 'react'
import { Plus, X, IndianRupee, User, Phone, MapPin, Calendar, Loader2 } from 'lucide-react'
import EmployeeNavbar from '../../components/Employee/EmployeeNavbar'

const API_URL = 'http://localhost:5000/api/labours'

const LabourManagement = () => {
  const [labourers, setLabourers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedLabour, setSelectedLabour] = useState(null)
  
  const [newLabour, setNewLabour] = useState({
    name: '',
    phone: '',
    address: ''
  })
  
  const [payment, setPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const getToken = () => localStorage.getItem('token')

  const fetchLabourers = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setLabourers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch labourers:', error)
      alert('Failed to load labourers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLabourers()
  }, [])

  const handleAddLabour = async (e) => {
    e.preventDefault()
    if (newLabour.name && newLabour.phone) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify(newLabour)
        })
        const data = await response.json()
        
        if (data.success) {
          await fetchLabourers()
          setNewLabour({ name: '', phone: '', address: '' })
          setShowAddForm(false)
          alert('Labourer added successfully!')
        } else {
          alert(data.error || 'Failed to add labourer')
        }
      } catch (error) {
        console.error('Add labourer error:', error)
        alert('Failed to add labourer')
      }
    }
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    if (payment.amount && selectedLabour) {
      try {
        const response = await fetch(`${API_URL}/${selectedLabour.id}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify(payment)
        })
        const data = await response.json()
        
        if (data.success) {
          await fetchLabourers()
          setPayment({ amount: '', date: new Date().toISOString().split('T')[0] })
          setShowPaymentModal(false)
          setSelectedLabour(null)
          alert('Payment added successfully!')
        } else {
          alert(data.error || 'Failed to add payment')
        }
      } catch (error) {
        console.error('Add payment error:', error)
        alert('Failed to add payment')
      }
    }
  }

  const openPaymentModal = (labour) => {
    setSelectedLabour(labour)
    setShowPaymentModal(true)
  }

  const deleteLabour = async (id) => {
    if (window.confirm('Are you sure you want to delete this labourer?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          await fetchLabourers()
          alert('Labourer deleted successfully!')
        } else {
          alert(data.error || 'Failed to delete labourer')
        }
      } catch (error) {
        console.error('Delete labourer error:', error)
        alert('Failed to delete labourer')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
            <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <EmployeeNavbar />
      </nav>
      <div className="max-w-8xl pt-23 mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Labour Management</h1>
              <p className="text-gray-600 mt-1">Manage labourers and track daily payments</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
            >
              <Plus size={20} />
              Add Labour
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Labour</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      value={newLabour.name}
                      onChange={(e) => setNewLabour({ ...newLabour, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      required
                      value={newLabour.phone}
                      onChange={(e) => setNewLabour({ ...newLabour, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      value={newLabour.address}
                      onChange={(e) => setNewLabour({ ...newLabour, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter address"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLabour}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
                  >
                    Add Labour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && selectedLabour && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add Payment</h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedLabour(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Labour Name</p>
                <p className="font-semibold text-gray-900">{selectedLabour.name}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={payment.amount}
                      onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="date"
                      required
                      value={payment.date}
                      onChange={(e) => setPayment({ ...payment, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      setSelectedLabour(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {labourers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <User className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Labourers Yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first labourer</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
            >
              <Plus size={20} />
              Add First Labour
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labourers.map((labour) => (
              <div key={labour.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{labour.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone size={14} />
                      {labour.phone}
                    </p>
                    {labour.address && (
                      <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                        <MapPin size={14} className="mt-0.5" />
                        <span className="line-clamp-2">{labour.address}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteLabour(labour.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <IndianRupee size={20} />
                    {labour.totalPaid?.toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Recent Payments</p>
                  {!labour.payments || labour.payments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No payments yet</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {labour.payments.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">{new Date(p.date).toLocaleDateString()}</span>
                          <span className="font-semibold text-gray-900">₹{p.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => openPaymentModal(labour)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
                >
                  <Plus size={18} />
                  Add Payment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LabourManagement