import type { Opportunity } from '../types/opportunity';
import {
  Calendar,
  CheckCircle,
  Eye,
  GraduationCap,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onView: (opp: Opportunity) => void;
  onEdit: (opp: Opportunity) => void;
  onClose: (opp: Opportunity) => void;
  onDelete: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onView,
  onEdit,
  onClose,
  onDelete,
}) => {
  const isClosed = opportunity.status === 'Closed';

  const formattedDeadline = new Date(
    opportunity.applicationDeadline,
  ).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className={`opp-card ${isClosed ? 'is-closed' : 'is-open'}`}>
      <div className="opp-card-header">
        <div className="opp-badges">
          <span className={`status-badge ${isClosed ? 'badge-closed' : 'badge-open'}`}>
            {opportunity.status}
          </span>
          <span className="research-area-badge">
            {opportunity.researchArea}
          </span>
        </div>
      </div>

      <h3 className="opp-title">{opportunity.title}</h3>
      <p className="opp-desc">{opportunity.description}</p>

      <div className="opp-meta">
        <div className="meta-item">
          <GraduationCap size={16} />
          <span>{opportunity.facultyMemberName} • {opportunity.department}</span>
        </div>
        <div className="meta-row">
          <div className="meta-item">
            <Users size={16} />
            <span>{opportunity.numberOfPositions} {opportunity.numberOfPositions === 1 ? 'Position' : 'Positions'}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>Deadline: {formattedDeadline}</span>
          </div>
        </div>
      </div>

      {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
        <div className="skills-container">
          {opportunity.requiredSkills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="opp-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onView(opportunity)}
          title="View full details"
        >
          <Eye size={15} />
          <span>Details</span>
        </button>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(opportunity)}
          title="Edit opportunity"
        >
          <Pencil size={15} />
          <span>Edit</span>
        </button>

        {!isClosed && (
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={() => onClose(opportunity)}
            title="Mark opportunity as Closed"
          >
            <CheckCircle size={15} />
            <span>Mark Closed</span>
          </button>
        )}

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(opportunity)}
          title="Delete opportunity"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
};
