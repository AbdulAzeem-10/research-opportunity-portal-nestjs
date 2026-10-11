import type { Opportunity } from '../types/opportunity';
import {
  Calendar,
  CheckCircle,
  GraduationCap,
  Users,
  X,
} from 'lucide-react';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onEdit: (opp: Opportunity) => void;
  onMarkClosed: (opp: Opportunity) => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  onClose,
  onEdit,
  onMarkClosed,
}) => {
  if (!opportunity) return null;

  const isClosed = opportunity.status === 'Closed';
  const deadlineDate = new Date(opportunity.applicationDeadline);
  const formattedDeadline = deadlineDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="opp-badges">
              <span className={`status-badge ${isClosed ? 'badge-closed' : 'badge-open'}`}>
                {opportunity.status}
              </span>
              <span className="research-area-badge">
                {opportunity.researchArea}
              </span>
            </div>
            <h2 className="modal-title">{opportunity.title}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <section className="detail-section">
            <h4 className="detail-section-title">Project Overview & Description</h4>
            <p className="detail-text">{opportunity.description}</p>
          </section>

          <div className="detail-grid">
            <div className="detail-card">
              <GraduationCap className="detail-card-icon" size={20} />
              <div>
                <span className="detail-label">Supervising Faculty</span>
                <p className="detail-value">{opportunity.facultyMemberName}</p>
                <span className="detail-sub">{opportunity.department}</span>
              </div>
            </div>

            <div className="detail-card">
              <Users className="detail-card-icon" size={20} />
              <div>
                <span className="detail-label">Available Positions</span>
                <p className="detail-value">{opportunity.numberOfPositions} Position(s)</p>
              </div>
            </div>

            <div className="detail-card">
              <Calendar className="detail-card-icon" size={20} />
              <div>
                <span className="detail-label">Application Deadline</span>
                <p className="detail-value">{formattedDeadline}</p>
              </div>
            </div>
          </div>

          <section className="detail-section">
            <h4 className="detail-section-title">Required Skills & Prerequisites</h4>
            <div className="skills-container">
              {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 ? (
                opportunity.requiredSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-muted">None specified</span>
              )}
            </div>
          </section>

          {opportunity.createdAt && (
            <div className="text-muted timestamp-text">
              Posted on {new Date(opportunity.createdAt).toLocaleDateString()}
              {opportunity.updatedAt && ` • Last updated ${new Date(opportunity.updatedAt).toLocaleDateString()}`}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              onClose();
              onEdit(opportunity);
            }}
          >
            Edit Opportunity
          </button>

          {!isClosed && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                onClose();
                onMarkClosed(opportunity);
              }}
            >
              <CheckCircle size={16} />
              Mark as Closed
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
