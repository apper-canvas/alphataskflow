import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskList from '@/components/organisms/TaskList';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import taskService from '@/services/api/taskService';

const Today = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [today, overdue] = await Promise.all([
        taskService.getTodayTasks(),
        taskService.getOverdueTasks()
      ]);
      
      setTodayTasks(today);
      setOverdueTasks(overdue);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s tasks');
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

  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={18} className="text-accent-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900">
            Today
          </h1>
        </div>
        <p className="text-surface-600">
          {formattedDate} • Focus on what matters most today
        </p>
      </motion.div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="AlertTriangle" size={18} className="text-error" />
            <h2 className="text-lg font-display font-semibold text-error">
              Overdue Tasks ({overdueTasks.length})
            </h2>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <TaskList
              tasks={overdueTasks}
              loading={false}
              error={null}
              onTaskUpdate={handleTaskUpdate}
              onQuickAdd={() => setIsQuickAddOpen(true)}
              emptyState={{
                icon: 'CheckCircle',
                title: 'No overdue tasks!',
                description: 'Great job staying on top of your tasks',
                actionLabel: null
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: overdueTasks.length > 0 ? 0.2 : 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-surface-900">
            Today's Tasks ({todayTasks.length})
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
          tasks={todayTasks}
          loading={loading}
          error={error}
          onRefresh={loadData}
          onTaskUpdate={handleTaskUpdate}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          emptyState={{
            icon: 'Calendar',
            title: 'No tasks for today',
            description: 'Enjoy your free day or add some tasks to stay productive',
            actionLabel: 'Add Task'
          }}
        />
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onTaskCreated={handleTaskUpdate}
      />
    </div>
  );
};

export default Today;