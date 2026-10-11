import { useState } from 'react';
import type {
  Opportunity,
  OpportunityFormData,
  OpportunityStatus,
} from '../types/opportunity';
import { AlertCircle, Loader2, X } from 'lucide-react';

interface OpportunityFormModalProps {
  isOpen: boolean;
  initialData?: Opportunity | null;
  onClose: () => void;
  onSubmit: (formData: Omit<Opportunity, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const OpportunityFormModal: React.FC<OpportunityFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <OpportunityFormModalContent
      initialData={initialData}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

interface ContentProps {
  initialData?: Opportunity | null;
  onClose: () => void;
  onSubmit: (formData: Omit<Opportunity, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const OpportunityFormModalContent: React.FC<ContentProps> = ({
  initialData,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<OpportunityFormData>(() => {
    if (initialData) {
      const formattedDate = initialData.applicationDeadline
        ? new Date(initialData.applicationDeadline).toISOString().split('T')[0]
        : '';
      return {
        title: initialData.title || '',
        description: initialData.description || '',
        researchArea: initialData.researchArea || '',
        facultyMemberName: initialData.facultyMemberName || '',
        department: initialData.department || '',
        requiredSkills: (initialData.requiredSkills || []).join(', '),
        numberOfPositions: initialData.numberOfPositions || 1,
        applicationDeadline: formattedDate,
        status: initialData.status || 'Open',
      };
    }
    return {
      title: '',
      description: '',
      researchArea: '',
      facultyMemberName: '',
      department: '',
      requiredSkills: '',
      numberOfPositions: 1,
      applicationDeadline: '',
      status: 'Open',
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPositions' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (!formData.researchArea.trim()) {
      setFormError('Research Area is required.');
      return;
    }
    if (!formData.facultyMemberName.trim()) {
      setFormError('Faculty Member Name is required.');
      return;
    }
    if (!formData.department.trim()) {
      setFormError('Department is required.');
      return;
    }
    if (formData.numberOfPositions < 1) {
      setFormError('Number of positions must be at least 1.');
      return;
    }
    if (!formData.applicationDeadline) {
      setFormError('Application deadline is required.');
      return;
    }

    const skillsArray = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: Omit<Opportunity, '_id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      researchArea: formData.researchArea.trim(),
      facultyMemberName: formData.facultyMemberName.trim(),
      department: formData.department.trim(),
      requiredSkills: skillsArray,
      numberOfPositions: Number(formData.numberOfPositions),
      applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      status: formData.status as OpportunityStatus,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Research Opportunity' : 'Create New Research Opportunity'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body form-grid">
            {formError && (
              <div className="alert alert-error" role="alert">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <div className="form-group full-width">
              <label htmlFor="title" className="form-label">
                Opportunity Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Deep Learning in Medical Imaging"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Project Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                rows={4}
                placeholder="Describe project objectives, student responsibilities, and expected outcomes..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="researchArea" className="form-label">
                Research Area <span className="required">*</span>
              </label>
              <input
                id="researchArea"
                name="researchArea"
                type="text"
                className="form-input"
                placeholder="e.g. Artificial Intelligence, Quantum Physics"
                value={formData.researchArea}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science, Physics"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="facultyMemberName" className="form-label">
                Supervising Faculty Name <span className="required">*</span>
              </label>
              <input
                id="facultyMemberName"
                name="facultyMemberName"
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Jane Smith"
                value={formData.facultyMemberName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="numberOfPositions" className="form-label">
                Number of Positions <span className="required">*</span>
              </label>
              <input
                id="numberOfPositions"
                name="numberOfPositions"
                type="number"
                min="1"
                step="1"
                className="form-input"
                value={formData.numberOfPositions}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicationDeadline" className="form-label">
                Application Deadline <span className="required">*</span>
              </label>
              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                className="form-input"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="requiredSkills" className="form-label">
                Required Skills (Comma separated)
              </label>
              <input
                id="requiredSkills"
                name="requiredSkills"
                type="text"
                className="form-input"
                placeholder="e.g. Python, PyTorch, Linear Algebra, Git"
                value={formData.requiredSkills}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="form-help">Separate individual skills with commas</span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Opportunity'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
