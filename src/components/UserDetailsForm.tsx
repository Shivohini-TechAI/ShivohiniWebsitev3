import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';
import { chatbotApiUrl } from '../config/api';

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
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (requirementOnly && existingUser) {
        await axios.post(chatbotApiUrl('/api/add-user-requirement'), {
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
        onSubmit(updatedDetails);
      } else {
        try {
          const { data: existingData } = await axios.get(
            chatbotApiUrl(`/api/check-user/${formData.email}`)
          );
          if (existingData && existingData.exists) {
            alert('This email is already registered. Please proceed or use another email.');
          }
        } catch (error) {
          console.log('Email check skipped');
        }
        
        await axios.post(chatbotApiUrl('/api/save-user'), formData);
        localStorage.setItem('userDetails', JSON.stringify(formData));
        localStorage.setItem('userDetailsSubmitted', 'true');
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-reveal">
      <div className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/10 bg-[#050f20] shadow-[0_20px_80px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem]">
        
        {/* Header section with gradient */}
        <div className="relative p-6 pb-0 sm:p-10 sm:pb-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/40 transition-colors hover:text-white sm:right-8 sm:top-8"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="mb-4 text-2xl font-display font-bold sm:text-3xl md:text-4xl">
            {requirementOnly ? (
              <>Tell us <span className="text-brand-gradient">more</span></>
            ) : (
              <>Welcome to <span className="text-brand-gradient">Shivohini</span></>
            )}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#00C8FF] to-[#7B61FF] rounded-full mb-6" />
          <p className="text-white/50 text-base font-sans leading-relaxed">
            {requirementOnly 
              ? 'Tell us what you need help with and our AI will assist you.' 
              : 'Please share your details to get personalized AI-driven assistance.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:space-y-6 sm:p-10">
          
          {!requirementOnly && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white font-sans focus:outline-none transition-all ${
                      errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#00C8FF]/50 focus:bg-white/[0.06]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white font-sans focus:outline-none transition-all ${
                      errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#00C8FF]/50 focus:bg-white/[0.06]'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {!requirementOnly && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white font-sans focus:outline-none transition-all ${
                      errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#00C8FF]/50 focus:bg-white/[0.06]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 ml-1">Company (Optional)</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white font-sans focus:outline-none transition-all focus:border-[#00C8FF]/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 ml-1">
              {requirementOnly ? 'New Requirement' : 'Your Requirement (Optional)'}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-white/30" />
              <textarea 
                name="requirement"  
                value={formData.requirement}
                onChange={handleChange}
                placeholder="What are you looking for?"
                className={`w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-xl text-white font-sans focus:outline-none transition-all resize-none ${
                    errors.requirement ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#00C8FF]/50 focus:bg-white/[0.06]'
                }`}       
                rows={3}  
              ></textarea>  
            </div>  
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#00C8FF] py-4 text-base font-bold text-[#050f20] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,200,255,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
          >   
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : requirementOnly ? 'Submit Requirement' : 'Continue to Assistant'}
          </button>  
        </form>   
      </div>
    </div>
  );
};

export default UserDetailsForm;
