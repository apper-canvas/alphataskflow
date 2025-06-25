import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import TaskList from '@/components/organisms/TaskList';
import SearchBar from '@/components/molecules/SearchBar';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  const loadArchivedTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const archivedTasks = await taskService.getArchivedTasks();
      setTasks(archivedTasks);
    } catch (err) {
      setError('Failed to load archived tasks');
      console.error('Error loading archived tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.categoryId.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  const handleRestore = async (taskId) => {
    try {
      await taskService.restoreTask(taskId);
      await loadArchivedTasks();
      toast.success('Task restored successfully! 📋');
    } catch (error) {
      toast.error('Failed to restore task');
      console.error('Error restoring task:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
            Archive
          </h1>
          <p className="text-surface-600">
            Manage your archived tasks
          </p>
        </div>
        <LoadingState count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
            Archive
          </h1>
          <p className="text-surface-600">
            Manage your archived tasks
          </p>
        </div>
        <ErrorState message={error} onRetry={loadArchivedTasks} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
          Archive
        </h1>
        <p className="text-surface-600 mb-4">
          Manage your archived tasks
        </p>
        
        {tasks.length > 0 && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search archived tasks..."
            className="max-w-md"
          />
        )}
      </div>

      <TaskList
        tasks={filteredTasks}
        loading={false}
        error={null}
        onRefresh={loadArchivedTasks}
        onTaskUpdate={loadArchivedTasks}
        onRestore={handleRestore}
        emptyState={{
          icon: 'Archive',
          title: 'No archived tasks',
          description: 'Tasks you archive will appear here',
          actionLabel: null
        }}
      />
    </div>
  );
};

export default Archive;