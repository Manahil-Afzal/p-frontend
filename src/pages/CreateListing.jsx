import { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import app  from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from "../config";


export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams(); 
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "https://p-backend-dtfsmzc21-manahil-afzals-projects.vercel.app/api";
  useEffect(() => {
    if (!params.listingId) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/listing/${params.listingId}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const listing = await res.json();

        setFormData(prev => ({
          ...prev,
          ...listing,
          imageUrls: listing.imageUrls || [],
        }));
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.message);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then(url => resolve(url))
      );
    });
  };

  const handleImageSubmit = async () => {
    if (files.length === 0) return;
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }

    setUploading(true);
    setImageUploadError('');

    try {
      const urls = await Promise.all(files.map(file => storeImage(file)));
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch {
      setImageUploadError('Image upload failed (2MB max per image)');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [id]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError('Upload at least one image');
    if (formData.offer && formData.discountPrice >= formData.regularPrice)
      return setError('Discount price must be lower than regular price');

    setLoading(true);
    setError('');

    try {
      const endpoint = params.listingId
        ? `${API_BASE_URL}/api/listing/update/${params.listingId}`
        : `${API_BASE_URL}/api/listing/create`;

      const method = params.listingId ? 'POST' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      navigate(`/listing/${data._id || params.listingId}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {params.listingId ? 'Update Listing' : 'Create Listing'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
            className="border p-3 rounded-lg"
          />
          <textarea
            placeholder="Description"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
            className="border p-3 rounded-lg"
          />
          {/* Type and features */}
          <div className="flex gap-6 flex-wrap">
            {['sale', 'rent'].map(type => (
              <div className="flex gap-2" key={type}>
                <input
                  type="checkbox"
                  id={type}
                  checked={formData.type === type}
                  onChange={handleChange}
                  className="w-5"
                />
                <span>{type === 'sale' ? 'Sell' : 'Rent'}</span>
              </div>
            ))}
            {['parking', 'furnished', 'offer'].map(feature => (
              <div className="flex gap-2" key={feature}>
                <input
                  type="checkbox"
                  id={feature}
                  checked={formData[feature]}
                  onChange={handleChange}
                  className="w-5"
                />
                <span>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                value={formData.bedrooms}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                value={formData.bathrooms}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                value={formData.regularPrice}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <p>Regular Price {formData.type === 'rent' && '($/month)'}</p>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
                <p>Discount Price {formData.type === 'rent' && '($/month)'}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="font-normal text-gray-600 ml-2">First image is cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setFiles(e.target.files)}
              className="p-3 border rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError}</p>
          {formData.imageUrls.map((url, index) => (
            <div key={url} className="flex justify-between p-3 border items-center">
              <img src={url} alt="listing" className="w-20 h-20 object-contain rounded-lg" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? (params.listingId ? 'Updating...' : 'Creating...') : (params.listingId ? 'Update Listing' : 'Create Listing')}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
