import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import EmptyState from "@/components/molecules/EmptyState";
import TaskCard from "@/components/molecules/TaskCard";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null, 
  onRefresh,
  onTaskUpdate,
  onQuickAdd,
  onRestore,
  emptyState = {},
  enableBulkActions = false
}) => {
const [updatingTasks, setUpdatingTasks] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [bulkOperating, setBulkOperating] = useState(false);
  const [timerOperations, setTimerOperations] = useState(new Set());

  // Force re-render for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      const hasRunningTimer = tasks.some(task => task.timeTracking?.isRunning);
      if (hasRunningTimer) {
        // Trigger re-render by updating state
        setTimerOperations(prev => new Set(prev));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleTimerStart = async (taskId) => {
    if (timerOperations.has(taskId)) return;

    setTimerOperations(prev => new Set([...prev, taskId]));
    
    try {
      await taskService.startTimer(taskId);
      onTaskUpdate?.();
      toast.success('Timer started! 🕐');
    } catch (error) {
      toast.error('Failed to start timer');
    } finally {
      setTimerOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleTimerStop = async (taskId) => {
    if (timerOperations.has(taskId)) return;

    setTimerOperations(prev => new Set([...prev, taskId]));
    
    try {
      await taskService.stopTimer(taskId);
      onTaskUpdate?.();
      toast.success('Timer stopped! ⏹️');
    } catch (error) {
toast.error('Failed to stop timer');
    } finally {
      setTimerOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(task => task.Id)));
    }
  };

  const handleSelectionChange = (taskId, selected) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const BulkActionsToolbar = () => {
    if (!selectionMode || selectedTasks.size === 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border border-surface-200 p-3 flex items-center gap-3 z-50"
      >
        <span className="text-sm font-medium text-surface-700">
          {selectedTasks.size} selected
        </span>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBulkComplete(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
          >
            <ApperIcon name="CheckSquare" size={16} />
            Complete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBulkDelete()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const handleBulkComplete = async (completed) => {
    if (selectedTasks.size === 0) return;
    
    setBulkOperating(true);
    const taskIds = Array.from(selectedTasks);
    
    try {
      await Promise.all(
        taskIds.map(taskId => 
          taskService.update(taskId, { completed })
        )
      );
      
      setSelectedTasks(new Set());
      setSelectionMode(false);
      onTaskUpdate?.();
      
      toast.success(`${taskIds.length} tasks ${completed ? 'completed' : 'marked incomplete'}`);
    } catch (error) {
      toast.error('Failed to update tasks');
    } finally {
      setBulkOperating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    
    const taskIds = Array.from(selectedTasks);
    if (!window.confirm(`Are you sure you want to delete ${taskIds.length} tasks?`)) {
      return;
    }
    
    setBulkOperating(true);
    
    try {
      await Promise.all(
        taskIds.map(taskId => taskService.delete(taskId))
      );
      
      setSelectedTasks(new Set());
      setSelectionMode(false);
      onTaskUpdate?.();
      
      toast.success(`${taskIds.length} tasks deleted`);
    } catch (error) {
      toast.error('Failed to delete tasks');
    } finally {
      setBulkOperating(false);
    }
  };
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

  const handleRestore = async (taskId) => {
    if (updatingTasks.has(taskId)) return;

    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      await onRestore?.(taskId);
    } catch (error) {
      toast.error('Failed to restore task');
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
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.actionLabel ? onQuickAdd : null}
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
      {/* Bulk Actions Header */}
      {enableBulkActions && tasks.length > 0 && (
        <div className="flex items-center justify-between bg-surface-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {selectionMode ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <ApperIcon name={selectedTasks.size === tasks.length ? "CheckSquare" : "Square"} size={16} />
                  {selectedTasks.size === tasks.length ? "Deselect All" : "Select All"}
                </motion.button>
                <span className="text-sm text-surface-500">
                  {selectedTasks.size} of {tasks.length} selected
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-surface-700">
                {tasks.length} tasks
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectionMode(!selectionMode)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-surface-600 hover:text-surface-900 bg-white rounded-md border border-surface-200 hover:border-surface-300 transition-colors"
          >
            <ApperIcon name={selectionMode ? "X" : "CheckSquare"} size={16} />
            {selectionMode ? "Cancel" : "Select"}
          </motion.button>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={updatingTasks.has(task.Id) || bulkOperating ? 'opacity-50 pointer-events-none' : ''}
          >
<TaskCard
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onTimerStart={handleTimerStart}
              onTimerStop={handleTimerStop}
              onRestore={onRestore ? handleRestore : null}
              categoryColors={categoryColors}
              selectionMode={selectionMode}
              selected={selectedTasks.has(task.Id)}
              onSelectionChange={handleSelectionChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <BulkActionsToolbar />
    </div>
  );
};

export default TaskList;