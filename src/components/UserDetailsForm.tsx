import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface UserDetailsFormProps {
  onSubmit: (userDetails: UserDetails) => void;
  onClose: () => void;
  existingUser?: UserDetails | null;
  requirementOnly?: boolean;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  company?: string;
  requirement?: string;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ 
  onSubmit, 
  onClose, 
  existingUser = null,
  requirementOnly = false 
}) => {
  const [formData, setFormData] = useState<UserDetails>({
    name: existingUser?.name || '',
    email: existingUser?.email || '',
    phone: existingUser?.phone || '',
    company: existingUser?.company || '',
    requirement: ''
  });
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};

    if (!requirementOnly) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    if (requirementOnly && !formData.requirement?.trim()) {
      newErrors.requirement = 'Please enter your requirement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (requirementOnly && existingUser) {
        // INSERT NEW ROW with all existing details + new requirement
        await axios.post('https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/api/add-user-requirement', {
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          company: existingUser.company,
          requirement: formData.requirement
        });
        
        const updatedDetails = { 
          ...existingUser, 
          requirement: formData.requirement 
        };
        localStorage.setItem('userDetails', JSON.stringify(updatedDetails));
        
        console.log('✅ New requirement saved');
        onSubmit(updatedDetails);
      } else {
        // Check if email already exists (for first-time users)
        try {
          const { data: existingData } = await axios.get(
            `https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/api/check-user/${formData.email}`
          );
          
          if (existingData && existingData.exists) {
            alert('This email is already registered. Please use a different email.');
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          console.log('Email check skipped');
        }
        
        // INSERT new user
        await axios.post('https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/api/save-user', formData);
        
        localStorage.setItem('userDetails', JSON.stringify(formData));
        localStorage.setItem('userDetailsSubmitted', 'true');
        
        console.log('✅ User details saved:', formData);
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error saving user details:', error);
      alert('Failed to save details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof UserDetails]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-2">
            {requirementOnly ? 'Update Requirement 📝' : 'Welcome! 👋'}
          </h2>
          <p className="text-blue-100 text-sm">
            {requirementOnly 
              ? 'Tell us what you need help with' 
              : 'Please share your details to get personalized assistance'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {!requirementOnly && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
              )}
            </div>
          )}

          {requirementOnly && existingUser && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {!requirementOnly && (
            <div>     
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>    
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input    
                  type="email"
                  name="email"      
                  value={formData.email}
                  onChange={handleChange}      
                  placeholder="Enter your email"  
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'  
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  }`}
                />     
              </div>    
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}     
            </div>  
          )}

          {requirementOnly && existingUser && (
            <div>   
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>  
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input          
                  type="email"    
                  value={formData.email}  
                  readOnly      
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />     
              </div>  
            </div>  
          )}

          {!requirementOnly && (
            <div> 
              <label className="block text-sm font-semibold text-gray-700 mb-2">  
                Phone Number <span className="text-red-500">*</span>
              </label>  
              <div className="relative">  
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />      
                <input
                  type="text"     
                  name="phone"
                  value={formData.phone}        
                  onChange={handleChange} 
                  placeholder="Enter your phone number" 
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${  
                    errors.phone  
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'  
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                  }`}       
                />  
              </div>
              {errors.phone && (  
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>  
              )}  
            </div>  
          )}

          {requirementOnly && existingUser && ( 
            <div> 
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number  
              </label>  
              <div className="relative">  
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />  
                <input          
                  type="text"     
                  value={formData.phone}  
                  readOnly
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />     
              </div>  
            </div>  
          )}

          {!requirementOnly && (
            <div>   
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"     
                  name="company"
                  value={formData.company}        
                  onChange={handleChange} 
                  placeholder="Enter your company name" 
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />  
              </div>
            </div>  
          )}

          <div>   
            <label className="block text-sm font-semibold text-gray-700 mb-2">      
              {requirementOnly ? 'Your Requirement' : 'Additional Requirement (Optional)'}
              {requirementOnly && <span className="text-red-500">*</span>}
            </label>  
            <div className="relative">  
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />  
              <textarea 
                name="requirement"  
                value={formData.requirement}
                onChange={handleChange}
                placeholder={requirementOnly ? "Describe your requirement" : "Enter any additional requirements"}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.requirement
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}       
                rows={4}  
              ></textarea>  
            </div>  
            {errors.requirement && (  
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.requirement}</p>  
            )}  
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"  
          >   
            {isSubmitting ? 'Submitting...' : requirementOnly ? 'Submit Requirement' : 'Submit Details'}
          </button>  
        </form>   
      </div>
    </div>
  );
};

export default UserDetailsForm;
