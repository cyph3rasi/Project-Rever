import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProfile = ({ walletAddress }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    twitter: '',
    github: '',
    website: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'avatar') {
      setAvatar(files[0]);
    } else if (name === 'cover') {
      setCover(files[0]);
    }
  };

  const validateUsername = async (username) => {
    try {
      const response = await fetch(`/api/profile/username/${username}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Username validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);

      // Validate username
      const isUsernameAvailable = await validateUsername(formData.username);
      if (!isUsernameAvailable) {
        throw new Error('Username is already taken');
      }

      // Create form data
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('bio', formData.bio);
      submitData.append('socialLinks', JSON.stringify({
        twitter: formData.twitter,
        github: formData.github,
        website: formData.website
      }));

      if (avatar) {
        submitData.append('avatar', avatar);
      }
      if (cover) {
        submitData.append('cover', cover);
      }

      // Submit to backend
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create profile');
      }

      // Redirect to profile page
      navigate(`/profile/${walletAddress}`);
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength={3}
            maxLength={30}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;