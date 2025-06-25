import taskData from "@/services/mockData/tasks.json";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(150);
    const task = this.tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  }

  async getByCategory(categoryId) {
    await delay(200);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async getTodayTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDate === today && !t.completed;
    }).map(t => ({ ...t }));
  }

  async getUpcomingTasks() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate > today;
    }).map(t => ({ ...t }));
  }

  async getCompletedTasks() {
    await delay(200);
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }));
  }

  async getOverdueTasks() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    }).map(t => ({ ...t }));
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      title: taskData.title,
      completed: false,
      categoryId: taskData.categoryId || 'work',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates,
      Id: this.tasks[index].Id // Preserve Id
    };

    // Handle completion status change
    if (updates.completed !== undefined && updates.completed !== this.tasks[index].completed) {
      updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
    }

    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
const deleted = this.tasks.splice(index, 1)[0];
    return { ...deleted };
  }
  async bulkDelete(ids) {
    await delay(300);
    const intIds = ids.map(id => parseInt(id, 10));
    const deleted = this.tasks.filter(t => intIds.includes(t.Id));
    this.tasks = this.tasks.filter(t => !intIds.includes(t.Id));
    return deleted.map(t => ({ ...t }));
  }

  async bulkUpdate(ids, updates) {
    await delay(350);
    const intIds = ids.map(id => parseInt(id, 10));
    const updatedTasks = [];
    
    for (const id of intIds) {
      const index = this.tasks.findIndex(t => t.Id === id);
      if (index !== -1) {
        const updatedTask = {
          ...this.tasks[index],
          ...updates,
          Id: this.tasks[index].Id // Preserve Id
        };

        // Handle completion status change
        if (updates.completed !== undefined && updates.completed !== this.tasks[index].completed) {
          updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
        }

        this.tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  }

  async bulkMoveToCategory(ids, categoryId) {
    await delay(300);
    const intIds = ids.map(id => parseInt(id, 10));
    const updatedTasks = [];
    
    for (const id of intIds) {
      const index = this.tasks.findIndex(t => t.Id === id);
      if (index !== -1) {
        const updatedTask = {
          ...this.tasks[index],
          categoryId: categoryId
        };
        
        this.tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  }

  async getTaskStats() {
    await delay(150);
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const today = this.getTodayTasks();
    const overdue = this.getOverdueTasks();
    
    return {
      total,
      completed,
      pending: total - completed,
      todayCount: (await today).length,
      overdueCount: (await overdue).length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}
}

export default new TaskService();