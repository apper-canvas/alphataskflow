import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskList from '@/components/organisms/TaskList';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import taskService from '@/services/api/taskService';

const StatCard = ({ icon, label, value, color = 'primary', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-all duration-150"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-surface-600 text-sm font-medium">{label}</p>
        <p className={`text-2xl font-display font-bold text-${color}-600 mt-1`}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
        <ApperIcon name={icon} size={24} className={`text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allTasks, taskStats] = await Promise.all([
        taskService.getAll(),
        taskService.getTaskStats()
      ]);
      
      setTasks(allTasks);
      setStats(taskStats);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskCreated = () => {
    loadData(); // Refresh data after creating a task
  };

  const handleTaskUpdate = () => {
    loadData(); // Refresh data after updating a task
  };

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
          Dashboard
        </h1>
        <p className="text-surface-600">
          Welcome back! Here's an overview of your tasks and progress.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="CheckSquare"
          label="Total Tasks"
          value={stats.total || 0}
          color="primary"
          delay={0}
        />
        <StatCard
          icon="Clock"
          label="Pending"
          value={stats.pending || 0}
          color="accent"
          delay={0.1}
        />
        <StatCard
          icon="CheckCircle"
          label="Completed"
          value={stats.completed || 0}
          color="success"
          delay={0.2}
        />
        <StatCard
          icon="TrendingUp"
          label="Completion Rate"
          value={`${stats.completionRate || 0}%`}
          color="info"
          delay={0.3}
        />
      </div>

      {/* Recent Tasks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-surface-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-surface-900">
            Recent Tasks
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsQuickAddOpen(true)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <ApperIcon name="Plus" size={16} />
            Add Task
          </motion.button>
        </div>

        <TaskList
          tasks={recentTasks}
          loading={loading}
          error={error}
          onRefresh={loadData}
          onTaskUpdate={handleTaskUpdate}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          emptyState={{
            icon: 'CheckSquare',
            title: 'No recent tasks',
            description: 'Create your first task to see it here',
            actionLabel: 'Create Task'
          }}
        />
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Dashboard;