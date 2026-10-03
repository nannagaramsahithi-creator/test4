import React, { useState } from 'react';
import DashboardView from './DashboardView';

export { DashboardView };

export const ReportLostView = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Personal Belongings',
    location: '',
    dateTime: '',
    contact: '',
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide an item name/title.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please specify where the item was lost.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      try {
        response = await fetch('/api/lost-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (proxyErr) {
        // Direct fallback to port 5000 if proxy fails
        response = await fetch('http://localhost:5000/api/lost-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit lost item report.');
      }

      setSuccessData(result.data);
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err.message || 'Unable to connect to backend server. Please verify the Express server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: 'Personal Belongings',
      location: '',
      dateTime: '',
      contact: '',
      description: '',
      imageUrl: '',
    });
    setError(null);
    setSuccessData(null);
  };

  return (
    <div className="view-wrapper">
      <div className="view-placeholder-card report-form-card">
        <div className="view-placeholder-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
          🔍
        </div>
        <h3>Report Lost Item</h3>
        <p>File a report with our campus network. Information is securely stored in MongoDB and indexed for AI match detection.</p>

        {/* Error Notification Alert */}
        {error && (
          <div className="form-error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-text-wrap">
              <strong>Submission Failed</strong>
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="btn-error-dismiss"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success State View */}
        {successData ? (
          <div className="form-success-banner lost-success">
            <span className="success-icon">🎉</span>
            <h4>Report Successfully Saved in Database!</h4>
            <p>
              Your report for <strong>"{successData.title}"</strong> has been logged to MongoDB Atlas and queued for similarity matching.
            </p>

            {/* Stored Document Reference Box */}
            <div className="success-meta-card">
              <div className="meta-card-row">
                <span className="meta-card-label">Database ID:</span>
                <code className="meta-card-code">#{successData._id}</code>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Category:</span>
                <span className="meta-card-val">{successData.category}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Reported Location:</span>
                <span className="meta-card-val">{successData.location}</span>
              </div>
              {successData.contact && (
                <div className="meta-card-row">
                  <span className="meta-card-label">Contact:</span>
                  <span className="meta-card-val">{successData.contact}</span>
                </div>
              )}
              <div className="meta-card-row">
                <span className="meta-card-label">Status:</span>
                <span className="badge-pill pill-warning">{successData.status?.toUpperCase() || 'LOST'}</span>
              </div>
              {successData.imageUrl && (
                <div className="success-image-thumb">
                  <span className="meta-card-label">Attached Photo:</span>
                  <img src={successData.imageUrl} alt={successData.title} />
                </div>
              )}
            </div>

            <div className="success-action-buttons">
              <button className="btn-dash-primary lost-accent" onClick={handleReset}>
                + File Another Report
              </button>
              {onNavigate && (
                <>
                  <button className="btn-dash-secondary" onClick={() => onNavigate('dashboard')}>
                    Back to Dashboard
                  </button>
                  <button className="btn-dash-secondary" onClick={() => onNavigate('view-reports')}>
                    Browse All Reports
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <form className="placeholder-form-grid" onSubmit={handleSubmit}>
            <div className="form-field-group">
              <label htmlFor="lost-item-title" className="form-label">
                Item Name <span className="required-star">*</span>
              </label>
              <input
                id="lost-item-title"
                name="title"
                type="text"
                className="input-field"
                placeholder="e.g. Blue Hydroflask Water Bottle, Sony Headphones, Leather Wallet..."
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="lost-item-category" className="form-label">
                  Category <span className="required-star">*</span>
                </label>
                <select
                  id="lost-item-category"
                  name="category"
                  className="input-field select-field"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Personal Belongings">Personal Belongings (Wallet, Bag, ID)</option>
                  <option value="Electronics">Electronics (Laptop, Phone, Tablet)</option>
                  <option value="Audio">Audio (Headphones, AirPods)</option>
                  <option value="Keys">Keys & Access Cards</option>
                  <option value="Accessories">Accessories & Jewelry</option>
                  <option value="Books/Stationery">Books & Stationery</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field-group">
                <label htmlFor="lost-item-location" className="form-label">
                  Lost Location / Campus Landmark <span className="required-star">*</span>
                </label>
                <input
                  id="lost-item-location"
                  name="location"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Central Library 2nd Floor, Science Hall Room 302..."
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="lost-item-datetime" className="form-label">
                  Approximate Date & Time Lost
                </label>
                <input
                  id="lost-item-datetime"
                  name="dateTime"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Today around 10:30 AM, Yesterday afternoon"
                  value={formData.dateTime}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="lost-item-contact" className="form-label">
                  Contact Info / NetID
                </label>
                <input
                  id="lost-item-contact"
                  name="contact"
                  type="text"
                  className="input-field"
                  placeholder="e.g. yourname@campus.edu or (555) 234-5678"
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Photo / Image URL Field */}
            <div className="form-field-group">
              <label htmlFor="lost-item-image" className="form-label">
                Photo URL <span className="label-optional">(Optional)</span>
              </label>
              <input
                id="lost-item-image"
                name="imageUrl"
                type="url"
                className="input-field"
                placeholder="https://images.unsplash.com/... or paste image URL"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={loading}
              />
              {formData.imageUrl && (
                <div className="image-preview-container">
                  <span className="preview-heading">Image Preview:</span>
                  <img
                    src={formData.imageUrl}
                    alt="Preview of lost item"
                    className="image-preview-thumb"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="lost-item-description" className="form-label">
                Detailed Description & Identifiers
              </label>
              <textarea
                id="lost-item-description"
                name="description"
                className="input-field textarea-field"
                placeholder="Distinctive marks, stickers, color, model number, scratches, or lockscreen wallpaper..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-dash-primary lost-accent btn-form-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <span>Submit Lost Item Report</span>
                )}
              </button>
              {onNavigate && (
                <button
                  type="button"
                  className="btn-dash-secondary"
                  onClick={() => onNavigate('dashboard')}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ReportFoundView = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    brand: '',
    color: '',
    dateFound: new Date().toISOString().split('T')[0],
    timeFound: '',
    locationFound: '',
    custody: 'Campus Safety / Circulation Desk',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImagePreview(loadEvent.target.result);
        setFormData((prev) => ({ ...prev, imageUrl: loadEvent.target.result }));
      };
      reader.readAsDataURL(file);
      if (error) setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFileName(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide an item name.');
      return;
    }
    if (!formData.locationFound.trim()) {
      setError('Please specify where the item was discovered.');
      return;
    }

    setLoading(true);
    setError(null);

    // Mock asynchronous submission simulation
    setTimeout(() => {
      const mockResult = {
        _id: `FND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        title: formData.title.trim(),
        category: formData.category,
        brand: formData.brand.trim() || 'Unknown / Unbranded',
        color: formData.color.trim() || 'Not specified',
        dateFound: formData.dateFound || new Date().toISOString().split('T')[0],
        timeFound: formData.timeFound || 'Approx. Now',
        locationFound: formData.locationFound.trim(),
        custody: formData.custody ? formData.custody.trim() : 'Campus Holding Desk',
        description: formData.description.trim(),
        imageUrl: imagePreview || formData.imageUrl || '',
        status: 'found',
        createdAt: new Date().toISOString(),
      };

      setSuccessData(mockResult);
      setLoading(false);
    }, 750);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: 'Electronics',
      description: '',
      brand: '',
      color: '',
      dateFound: new Date().toISOString().split('T')[0],
      timeFound: '',
      locationFound: '',
      custody: 'Campus Safety / Circulation Desk',
      imageUrl: '',
    });
    setImagePreview(null);
    setSelectedFileName(null);
    setError(null);
    setSuccessData(null);
  };

  return (
    <div className="view-wrapper">
      <div className="view-placeholder-card report-form-card found-form-card">
        <div className="view-placeholder-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          🎁
        </div>
        <h3>Report Found Item</h3>
        <p>Log a discovered belonging to notify owners and coordinate handoff through campus custody.</p>

        {/* Error Notification Alert */}
        {error && (
          <div className="form-error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-text-wrap">
              <strong>Validation Error</strong>
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="btn-error-dismiss"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success State View */}
        {successData ? (
          <div className="form-success-banner found-success">
            <span className="success-icon">✨</span>
            <h4>Found Item Successfully Logged!</h4>
            <p>
              Thank you for helping reunite campus members with their property. <strong>"{successData.title}"</strong> is now cataloged and queued for automatic similarity matching.
            </p>

            {/* Stored Document Reference Box */}
            <div className="success-meta-card">
              <div className="meta-card-row">
                <span className="meta-card-label">Reference ID:</span>
                <code className="meta-card-code" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                  #{successData._id}
                </code>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Category:</span>
                <span className="meta-card-val">{successData.category}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Brand & Color:</span>
                <span className="meta-card-val">{successData.brand} • {successData.color}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Discovered At:</span>
                <span className="meta-card-val">{successData.locationFound}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Date & Time Found:</span>
                <span className="meta-card-val">{successData.dateFound} {successData.timeFound ? `at ${successData.timeFound}` : ''}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Current Custody:</span>
                <span className="meta-card-val highlight-custody">{successData.custody}</span>
              </div>
              <div className="meta-card-row">
                <span className="meta-card-label">Status:</span>
                <span className="badge-pill pill-success">{successData.status?.toUpperCase() || 'FOUND'}</span>
              </div>
              {successData.imageUrl && (
                <div className="success-image-thumb">
                  <span className="meta-card-label">Uploaded Image:</span>
                  <img src={successData.imageUrl} alt={successData.title} />
                </div>
              )}
            </div>

            <div className="success-action-buttons">
              <button className="btn-dash-primary found-accent" onClick={handleReset}>
                + Log Another Found Item
              </button>
              {onNavigate && (
                <>
                  <button className="btn-dash-secondary" onClick={() => onNavigate('dashboard')}>
                    Back to Dashboard
                  </button>
                  <button className="btn-dash-secondary" onClick={() => onNavigate('view-reports')}>
                    Browse All Reports
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <form className="placeholder-form-grid" onSubmit={handleSubmit}>
            {/* 1. Item Name */}
            <div className="form-field-group">
              <label htmlFor="found-item-title" className="form-label">
                Found Item Name <span className="required-star">*</span>
              </label>
              <input
                id="found-item-title"
                name="title"
                type="text"
                className="input-field"
                placeholder="e.g. Wireless AirPods Case, Toyota Key Fob, Brown Leather Wallet..."
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                required
                autoFocus
              />
            </div>

            {/* 2. Category & Brand */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="found-item-category" className="form-label">
                  Category <span className="required-star">*</span>
                </label>
                <select
                  id="found-item-category"
                  name="category"
                  className="input-field select-field"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Electronics">Electronics (Laptop, Phone, Tablet)</option>
                  <option value="Personal Belongings">Personal Belongings (Wallet, Bag, ID)</option>
                  <option value="Audio">Audio (Headphones, AirPods)</option>
                  <option value="Keys">Keys & Access Cards</option>
                  <option value="Accessories">Accessories & Jewelry</option>
                  <option value="Books/Stationery">Books & Stationery</option>
                  <option value="Clothing/Apparel">Clothing & Apparel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field-group">
                <label htmlFor="found-item-brand" className="form-label">
                  Brand / Manufacturer
                </label>
                <input
                  id="found-item-brand"
                  name="brand"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Apple, Sony, Hydroflask, Toyota, Fossil..."
                  value={formData.brand}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* 3. Color & Location Found */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="found-item-color" className="form-label">
                  Primary Color / Finish
                </label>
                <input
                  id="found-item-color"
                  name="color"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Space Gray, Matte Black, Silver, Navy Blue..."
                  value={formData.color}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="found-item-location" className="form-label">
                  Location Found / Campus Landmark <span className="required-star">*</span>
                </label>
                <input
                  id="found-item-location"
                  name="locationFound"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Room 204 Humanities Hall, West Deck Elevator..."
                  value={formData.locationFound}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* 4. Date Found & Time Found */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="found-item-date" className="form-label">
                  Date Found
                </label>
                <input
                  id="found-item-date"
                  name="dateFound"
                  type="date"
                  className="input-field"
                  value={formData.dateFound}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="found-item-time" className="form-label">
                  Time Found
                </label>
                <input
                  id="found-item-time"
                  name="timeFound"
                  type="time"
                  className="input-field"
                  value={formData.timeFound}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* 5. Current Custody / Holding Location */}
            <div className="form-field-group">
              <label htmlFor="found-item-custody" className="form-label">
                Current Holding Location / Custody Desk
              </label>
              <input
                id="found-item-custody"
                name="custody"
                type="text"
                className="input-field"
                placeholder="e.g. Campus Safety Dispatch, Library Circulation Desk, Student Union Info..."
                value={formData.custody}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* 6. Detailed Description */}
            <div className="form-field-group">
              <label htmlFor="found-item-description" className="form-label">
                Detailed Description & Distinguishing Features
              </label>
              <textarea
                id="found-item-description"
                name="description"
                className="input-field textarea-field"
                placeholder="Case markings, condition, serial/model number, stickers, or current storage locker details..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* 7. Image Upload / Photo Attachment */}
            <div className="form-field-group">
              <label className="form-label">
                Item Image / Photo <span className="label-optional">(Optional)</span>
              </label>

              {/* Drag and Drop Upload Zone */}
              <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="found-item-file"
                  type="file"
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <span className="dropzone-icon">📷</span>
                <span className="dropzone-primary-text">
                  Drop a photo here, or <strong style={{ color: '#10b981' }}>browse files</strong>
                </span>
                <span className="dropzone-subtext">Supports PNG, JPG, WEBP up to 5MB</span>
              </div>

              {/* Selected File & Image Preview */}
              {imagePreview && (
                <div className="file-selected-card">
                  <div className="file-selected-info">
                    <img
                      src={imagePreview}
                      alt="Found item preview"
                      className="image-preview-thumb-mini"
                    />
                    <span className="file-selected-name">
                      {selectedFileName || 'Attached Image Preview'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={handleRemoveImage}
                    disabled={loading}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              {/* Alternative Image URL Input */}
              <div className="upload-or-divider">
                <span>or paste image URL</span>
              </div>

              <input
                id="found-item-image-url"
                name="imageUrl"
                type="url"
                className="input-field"
                placeholder="https://images.unsplash.com/... or web image link"
                value={formData.imageUrl}
                onChange={(e) => {
                  handleChange(e);
                  setImagePreview(e.target.value);
                }}
                disabled={loading}
              />
            </div>

            {/* Submit Action Row */}
            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-dash-primary found-accent btn-form-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Cataloging Found Item...</span>
                  </>
                ) : (
                  <span>Submit Found Item Report</span>
                )}
              </button>
              {onNavigate && (
                <button
                  type="button"
                  className="btn-dash-secondary"
                  onClick={() => onNavigate('dashboard')}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ViewReportsView = () => (
  <div className="view-wrapper">
    <div className="view-placeholder-card">
      <div className="view-placeholder-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
        🧭
      </div>
      <h3>Public Lost & Found Directory</h3>
      <p>Search and filter all community reports by status, category, date, and radius.</p>
      <div className="filter-chips-row">
        <span className="filter-chip active">All Reports (83)</span>
        <span className="filter-chip">🔴 Lost Items (48)</span>
        <span className="filter-chip">🟢 Found Items (35)</span>
        <span className="filter-chip">⭐ Recently Recovered</span>
      </div>
      <span className="placeholder-tag">Ready for Filterable Item Catalog Implementation</span>
    </div>
  </div>
);

export const MyReportsView = () => (
  <div className="view-wrapper">
    <div className="view-placeholder-card">
      <div className="view-placeholder-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
        📁
      </div>
      <h3>My Reports & Activity</h3>
      <p>Track your submitted lost/found items, view intelligent matching candidates, and manage recovery handshakes.</p>
      <div className="my-reports-sample-list">
        <div className="activity-row">
          <span>🎒 Navy Herschel Backpack</span>
          <span className="badge-pill pill-warning">Lost • In Review</span>
        </div>
        <div className="activity-row">
          <span>🔑 Toyota Car Key Fob</span>
          <span className="badge-pill pill-info">Matched (94% Match)</span>
        </div>
      </div>
      <span className="placeholder-tag">Ready for Personal Item Management Implementation</span>
    </div>
  </div>
);

export const NotificationsView = () => (
  <div className="view-wrapper">
    <div className="view-placeholder-card">
      <div className="view-placeholder-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
        🔔
      </div>
      <h3>Notification Center</h3>
      <p>Stay updated on potential matches, verification questions, and secure claim requests.</p>
      <div className="notif-sample-list">
        <div className="notif-sample-item">
          <strong>⚡ High-Confidence Match:</strong> A found report matches your lost "Navy Herschel Backpack" in Central Library.
        </div>
        <div className="notif-sample-item">
          <strong>💬 New Message:</strong> Campus Security sent a verification photo for your claim.
        </div>
      </div>
      <span className="placeholder-tag">Ready for Live Notifications & Real-Time Alerts</span>
    </div>
  </div>
);

export const ProfileView = () => (
  <div className="view-wrapper">
    <div className="view-placeholder-card">
      <div className="view-placeholder-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
        👤
      </div>
      <h3>User Profile & Settings</h3>
      <p>Manage your contact verification, preferred recovery meetup spots, and privacy settings.</p>
      <div className="profile-placeholder-summary">
        <div><strong>Name:</strong> Alex Rivera</div>
        <div><strong>Campus Email:</strong> alex.rivera@university.edu</div>
        <div><strong>Verification Status:</strong> Verified Campus Member (Badge ID #8921)</div>
      </div>
      <span className="placeholder-tag">Ready for Profile & Preferences Configuration</span>
    </div>
  </div>
);
