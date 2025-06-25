import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import LoadingState from '@/components/molecules/LoadingState';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import taskService from '@/services/api/taskService';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null, 
  onRefresh,
  onTaskUpdate,
  onQuickAdd,
  emptyState = {}
}) => {
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  const handleToggleComplete = async (taskId, completed) => {
    if (updatingTasks.has(taskId)) return;

    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      onTaskUpdate?.(updatedTask);
      
      if (completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (updatingTasks.has(taskId)) return;

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      await taskService.delete(taskId);
      onTaskUpdate?.();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  if (loading) {
    return <LoadingState count={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={emptyState.icon || 'CheckSquare'}
        title={emptyState.title || 'No tasks found'}
        description={emptyState.description || 'Create your first task to get started'}
        actionLabel={emptyState.actionLabel || 'Add Task'}
        onAction={onQuickAdd}
      />
    );
  }

  const categoryColors = {
    work: '#5b21b6',
    personal: '#10b981',
    development: '#3b82f6',
    health: '#f59e0b',
    learning: '#8b5cf6'
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={updatingTasks.has(task.Id) ? 'opacity-50 pointer-events-none' : ''}
          >
            <TaskCard
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              categoryColors={categoryColors}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;