import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import categoryService from '@/services/api/categoryService';
import taskService from '@/services/api/taskService';

const CategoryCard = ({ category, taskCount, onEdit, onDelete, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="bg-white border border-surface-200 rounded-lg p-6 hover:shadow-lg transition-all duration-150"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: `${category.color}15`,
            color: category.color 
          }}
        >
          <ApperIcon name={category.icon} size={20} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-surface-900">
            {category.name}
          </h3>
          <p className="text-sm text-surface-600">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(category)}
          className="p-2 text-surface-400 hover:text-surface-600 rounded-lg"
        >
          <ApperIcon name="Edit2" size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(category.Id)}
          className="p-2 text-surface-400 hover:text-error rounded-lg"
        >
          <ApperIcon name="Trash2" size={16} />
        </motion.button>
      </div>
    </div>
    
    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: taskCount > 0 ? '100%' : '0%' }}
        transition={{ delay: delay + 0.5, duration: 0.8 }}
        className="h-full rounded-full"
        style={{ backgroundColor: category.color }}
      />
    </div>
  </motion.div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [categoriesData, allTasks] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      setCategories(categoriesData);
      
      // Calculate task counts per category
      const counts = {};
      categoriesData.forEach(category => {
        counts[category.Id] = allTasks.filter(task => 
          task.categoryId === category.name.toLowerCase()
        ).length;
      });
      setTaskCounts(counts);
      
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      toast.success('Category deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleEditCategory = (category) => {
    // For this MVP, we'll show a simple alert
    // In a full app, this would open an edit modal
    alert(`Edit functionality for "${category.name}" category would be implemented here.`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-surface-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load categories</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Folder" size={18} className="text-purple-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                Categories
              </h1>
            </div>
            <p className="text-surface-600">
              Organize your tasks with custom categories and track your progress
            </p>
          </div>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => alert('Add category functionality would be implemented here')}
          >
            Add Category
          </Button>
        </div>
      </motion.div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Folder" size={32} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
            No categories yet
          </h3>
          <p className="text-surface-600 mb-6">
            Create your first category to start organizing your tasks
          </p>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => alert('Add category functionality would be implemented here')}
          >
            Create Category
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.Id}
              category={category}
              taskCount={taskCounts[category.Id] || 0}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              delay={index * 0.1}
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-surface-50 rounded-lg p-6"
        >
          <h2 className="text-lg font-display font-semibold text-surface-900 mb-4">
            Category Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary-600">
                {categories.length}
              </div>
              <div className="text-sm text-surface-600">
                Total Categories
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-accent-600">
                {Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="text-sm text-surface-600">
                Total Tasks
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-success">
                {Math.max(...Object.values(taskCounts), 0)}
              </div>
              <div className="text-sm text-surface-600">
                Most Tasks
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-info">
                {(Object.values(taskCounts).reduce((sum, count) => sum + count, 0) / categories.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-surface-600">
                Avg per Category
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Categories;