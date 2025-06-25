import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskList from '@/components/organisms/TaskList';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import taskService from '@/services/api/taskService';

const Upcoming = () => {
const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Auto-refresh for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      const hasRunningTimer = upcomingTasks.some(task => task.timeTracking?.isRunning);
      if (hasRunningTimer) {
        loadData();
      }
    }, 10000); // Refresh every 10 seconds if timers are running

    return () => clearInterval(interval);
  }, [upcomingTasks]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tasks = await taskService.getUpcomingTasks();
      setUpcomingTasks(tasks);
    } catch (err) {
      setError(err.message || 'Failed to load upcoming tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskUpdate = () => {
    loadData();
  };

  // Group tasks by time period
  const groupedTasks = upcomingTasks.reduce((groups, task) => {
    if (!task.dueDate) {
      if (!groups.later) groups.later = [];
      groups.later.push(task);
      return groups;
    }

    const dueDate = parseISO(task.dueDate);
    
    if (isThisWeek(dueDate)) {
      if (!groups.thisWeek) groups.thisWeek = [];
      groups.thisWeek.push(task);
    } else if (isThisMonth(dueDate)) {
      if (!groups.thisMonth) groups.thisMonth = [];
      groups.thisMonth.push(task);
    } else {
      if (!groups.later) groups.later = [];
      groups.later.push(task);
    }
    
    return groups;
  }, {});

  const TaskSection = ({ title, tasks = [], icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name={icon} size={18} className="text-primary-600" />
        <h2 className="text-lg font-display font-semibold text-surface-900">
          {title} ({tasks.length})
        </h2>
      </div>
      
      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          loading={false}
          error={null}
          onTaskUpdate={handleTaskUpdate}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      ) : (
        <div className="text-surface-500 text-sm italic bg-surface-50 rounded-lg p-4">
          No tasks in this period
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" size={18} className="text-primary-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900">
            Upcoming
          </h1>
        </div>
        <p className="text-surface-600">
          Plan ahead and stay organized with your future tasks
        </p>
      </motion.div>

      {/* Add Task Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full bg-primary-50 border-2 border-dashed border-primary-200 rounded-lg p-4 text-primary-600 hover:bg-primary-100 hover:border-primary-300 transition-all duration-150 flex items-center justify-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span className="font-medium">Add New Task</span>
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="space-y-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-surface-200 rounded w-48 animate-pulse" />
              <div className="space-y-3">
                {[0, 1].map(j => (
                  <div key={j} className="h-20 bg-surface-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load tasks</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      ) : (
        <>
          {/* This Week */}
          <TaskSection
            title="This Week"
            tasks={groupedTasks.thisWeek || []}
            icon="Calendar"
            delay={0.1}
          />

          {/* This Month */}
          <TaskSection
            title="This Month"
            tasks={groupedTasks.thisMonth || []}
            icon="CalendarDays"
            delay={0.2}
          />

          {/* Later */}
          <TaskSection
            title="Later"
            tasks={groupedTasks.later || []}
            icon="Clock"
            delay={0.3}
          />

          {upcomingTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Clock" size={32} className="text-surface-400" />
              </div>
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
                No upcoming tasks
              </h3>
              <p className="text-surface-600 mb-6">
                You're all caught up! Add some future tasks to stay organized.
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onTaskCreated={handleTaskUpdate}
      />
    </div>
  );
};

export default Upcoming;