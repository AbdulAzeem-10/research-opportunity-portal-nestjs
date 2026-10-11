import type { Opportunity } from '../types/opportunity';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  opportunity,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="delete-header-icon">
            <AlertTriangle size={24} className="text-danger" />
          </div>
          <h2 className="modal-title">Delete Opportunity</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-confirm-text">
            Are you sure you want to delete the research opportunity:
          </p>
          <div className="delete-opp-preview">
            <strong>"{opportunity.title}"</strong>
            <div className="text-muted small">
              {opportunity.facultyMemberName} • {opportunity.department}
            </div>
          </div>
          <p className="delete-warning">
            This action cannot be undone and will permanently remove this opportunity from the portal.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="spinner" size={16} />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete Opportunity</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
