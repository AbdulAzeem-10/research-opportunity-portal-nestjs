import { useCallback, useEffect, useState } from 'react';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { OpportunityFormModal } from './components/OpportunityFormModal';
import { api } from './services/api';
import type { Opportunity } from './types/opportunity';
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

export function App() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewingOpp, setViewingOpp] = useState<Opportunity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [deletingOpp, setDeletingOpp] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const data = await api.getOpportunities(statusFilter);
      setOpportunities(data);
    } catch (err: any) {
      setApiError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleOpenCreateForm = () => {
    setEditingOpp(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (opp: Opportunity) => {
    setEditingOpp(opp);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: Omit<Opportunity, '_id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingOpp) {
      await api.updateOpportunity(editingOpp._id, data);
      setNotification({
        type: 'success',
        message: `Opportunity "${data.title}" updated successfully!`,
      });
    } else {
      await api.createOpportunity(data);
      setNotification({
        type: 'success',
        message: `Opportunity "${data.title}" created successfully!`,
      });
    }
    await fetchOpportunities();
  };

  const handleMarkClosed = async (opp: Opportunity) => {
    try {
      await api.closeOpportunity(opp._id);
      setNotification({
        type: 'success',
        message: `Opportunity "${opp.title}" marked as Closed.`,
      });
      await fetchOpportunities();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to close opportunity.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingOpp) return;
    try {
      setIsDeleting(true);
      await api.deleteOpportunity(deletingOpp._id);
      setNotification({
        type: 'success',
        message: `Opportunity "${deletingOpp.title}" deleted successfully.`,
      });
      setDeletingOpp(null);
      await fetchOpportunities();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete opportunity.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered opportunities based on client search
  const displayedOpportunities = opportunities.filter((opp) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.department.toLowerCase().includes(query) ||
      opp.facultyMemberName.toLowerCase().includes(query) ||
      opp.researchArea.toLowerCase().includes(query) ||
      (opp.requiredSkills &&
        opp.requiredSkills.some((s) => s.toLowerCase().includes(query)))
    );
  });

  const totalPositions = opportunities
    .filter((o) => o.status === 'Open')
    .reduce((sum, o) => sum + (o.numberOfPositions || 0), 0);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="brand-title">University Research Portal</h1>
              <p className="brand-subtitle">Undergraduate & Graduate Research Opportunities</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreateForm}
              id="btn-create-opportunity"
            >
              <Plus size={18} />
              <span>Post Opportunity</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`toast toast-${notification.type}`}
            role="status"
            aria-live="polite"
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dashboard Banner & Stats */}
        <section className="portal-banner">
          <div className="banner-text">
            <h2>Explore Active Research Positions</h2>
            <p>
              Connect with leading faculty and laboratory projects across university departments.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{opportunities.length}</span>
              <span className="stat-label">Total Listings</span>
            </div>
            <div className="stat-card">
              <span className="stat-number stat-highlight">
                {opportunities.filter((o) => o.status === 'Open').length}
              </span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalPositions}</span>
              <span className="stat-label">Open Spots</span>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="filter-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, faculty, skill, department, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search opportunities"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-tabs" role="tablist" aria-label="Status filters">
            {(['All', 'Open', 'Closed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab}
                className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
                <span className="tab-count">
                  {tab === 'All'
                    ? opportunities.length
                    : opportunities.filter((o) => o.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={fetchOpportunities}
            title="Refresh listings"
            aria-label="Refresh listings"
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          </button>
        </section>

        {/* Error Alert */}
        {apiError && (
          <div className="alert alert-error mb-4" role="alert">
            <AlertCircle size={20} />
            <div className="alert-content">
              <strong>Unable to load opportunities</strong>
              <p>{apiError}</p>
              <button
                type="button"
                className="btn btn-outline btn-sm mt-2"
                onClick={fetchOpportunities}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="loading-state">
            <Loader2 size={36} className="spinner" />
            <p>Loading research opportunities from the portal...</p>
          </div>
        ) : displayedOpportunities.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon-box">
              <Sparkles size={36} />
            </div>
            <h3>No Research Opportunities Found</h3>
            <p>
              {searchQuery
                ? `No opportunities match "${searchQuery}". Try clearing your search filter.`
                : statusFilter !== 'All'
                ? `There are currently no opportunities with status "${statusFilter}".`
                : 'No research opportunities have been posted yet. Be the first to add one!'}
            </p>
            <div className="empty-actions">
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenCreateForm}
              >
                <Plus size={16} />
                <span>Post an Opportunity</span>
              </button>
            </div>
          </div>
        ) : (
          /* Opportunities Grid */
          <div className="opp-grid">
            {displayedOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
                onView={(opp) => setViewingOpp(opp)}
                onEdit={(opp) => handleOpenEditForm(opp)}
                onClose={(opp) => handleMarkClosed(opp)}
                onDelete={(opp) => setDeletingOpp(opp)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <OpportunityDetailsModal
        opportunity={viewingOpp}
        onClose={() => setViewingOpp(null)}
        onEdit={(opp) => {
          setViewingOpp(null);
          handleOpenEditForm(opp);
        }}
        onMarkClosed={(opp) => {
          setViewingOpp(null);
          handleMarkClosed(opp);
        }}
      />

      <OpportunityFormModal
        isOpen={isFormOpen}
        initialData={editingOpp}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOpp(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        opportunity={deletingOpp}
        isOpen={Boolean(deletingOpp)}
        isDeleting={isDeleting}
        onClose={() => setDeletingOpp(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
