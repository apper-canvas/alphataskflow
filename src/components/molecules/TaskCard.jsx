import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onTimerStart,
  onTimerStop,
  categoryColors = {},
  className = '',
  selectionMode = false,
  selected = false,
  onSelectionChange
}) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (task.timeTracking?.isRunning && task.timeTracking.currentSession) {
      interval = setInterval(() => {
        const startTime = new Date(task.timeTracking.currentSession.startTime);
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const totalTime = (task.timeTracking?.totalTime || 0) + elapsed;
        setCurrentTime(totalTime);
      }, 1000);
    } else {
      setCurrentTime(task.timeTracking?.totalTime || 0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.timeTracking]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isPast(date) && !isToday(date)) return `Overdue`;
    return format(date, 'MMM d');
  };

  const isDue = task.dueDate && (isToday(parseISO(task.dueDate)) || isPast(parseISO(task.dueDate))) && !task.completed;
  const categoryColor = categoryColors[task.categoryId] || '#6b7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.15 }}
      className={`
        bg-white border border-surface-200 rounded-lg p-4 
        transition-all duration-150 cursor-pointer
        ${task.completed ? 'opacity-60' : ''}
        ${className}
      `}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: getPriorityColor(task.priority)
      }}
    >
<div className="flex items-start gap-3">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="mt-0.5"
        >
          <Checkbox
            checked={selectionMode ? selected : task.completed}
            onChange={selectionMode ? 
              (e) => onSelectionChange?.(task.Id, e.target.checked) : 
              (e) => onToggleComplete(task.Id, e.target.checked)
            }
            size="md"
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 
              className={`font-medium text-surface-900 leading-snug ${
                task.completed ? 'line-through text-surface-500' : ''
              }`}
              onClick={() => onEdit?.(task)}
            >
              {task.title}
            </h3>
            
<div className="flex items-center gap-2">
              {/* Time Tracking Display */}
              {(currentTime > 0 || task.timeTracking?.isRunning) && (
                <div className="flex items-center gap-1 text-xs text-surface-600 bg-surface-50 px-2 py-1 rounded-md">
                  <ApperIcon name="Clock" size={12} />
                  <span className={task.timeTracking?.isRunning ? 'text-primary-600 font-medium' : ''}>
                    {formatTime(currentTime)}
                  </span>
                </div>
              )}
              
              {/* Timer Controls */}
              {onTimerStart && onTimerStop && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.timeTracking?.isRunning) {
                      onTimerStop(task.Id);
                    } else {
                      onTimerStart(task.Id);
                    }
                  }}
                  className={`p-1 rounded ${
                    task.timeTracking?.isRunning 
                      ? 'text-error hover:text-red-700 bg-red-50' 
                      : 'text-green-600 hover:text-green-700 bg-green-50'
                  }`}
                  title={task.timeTracking?.isRunning ? 'Stop timer' : 'Start timer'}
                >
                  <ApperIcon 
                    name={task.timeTracking?.isRunning ? "Square" : "Play"} 
                    size={14} 
                  />
                </motion.button>
              )}
              
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 text-surface-400 hover:text-surface-600 rounded"
                >
                  <ApperIcon name="Edit2" size={14} />
                </motion.button>
              )}
              
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.Id);
                  }}
                  className="p-1 text-surface-400 hover:text-error rounded"
                >
                  <ApperIcon name="Trash2" size={14} />
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="default"
              color={categoryColor}
              size="sm"
            >
              {task.categoryId}
            </Badge>
            
            <Badge 
              variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
              size="sm"
            >
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <Badge 
                variant={isDue ? 'error' : 'default'}
                size="sm"
              >
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {formatDueDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;