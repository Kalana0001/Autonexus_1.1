import React, { useEffect, useState } from 'react';
import {
  Car,
  Heart,
  MessageSquare,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../../components/main/layout/Navbar';
import Footer from '../../../components/main/layout/Footer';
import axios from 'axios';
import GarageProfileFormSection from '../../../components/landing/sections/garage/GarageProfileFormSection';
import GarageProfileHeaderSection from '../../../components/landing/sections/garage/GarageProfileHeaderSection';

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
  listingsCount: number;
  soldCount: number;
  favoritesCount: number;
}

const GrageProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set axios default auth header for all API calls after getting token
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    document.title = 'AutoNexus - Your Profile';

    const fetchUserProfile = async () => {
      try {
        // Try getting token from localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        // Set axios default header globally
        setAuthToken(token);

        const res = await axios.get<UserProfile>('http://localhost:5000/api/user');

        setUser(res.data);
        setLoading(false);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Unauthorized. Please login again.');
          } else {
            setError('Failed to fetch profile data.');
          }
        } else {
          setError('An error occurred while fetching profile data.');
        }
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Cleanup axios header on unmount (optional)
    return () => {
      setAuthToken(null);
    };
  }, []);
  

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="space-y-8 sm:px-8 md:px-12 lg:px-24 pb-16 pt-20">
        {/* Profile Header */}

        <GarageProfileHeaderSection/>
        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Animated Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">

            {activeTab === 'settings' && (
                <motion.div key="settings" {...animationProps}>
                  <h2 className="text-xl font-semibold mb-6">Settings</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8">
                    <GarageProfileFormSection/>
                  </div>
                </motion.div>
              )}  
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GrageProfile;
