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
      completedAt: null,
      timeTracking: {
        totalTime: 0,
        sessions: [],
        currentSession: null,
        isRunning: false
      }
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

    // Handle archive status change
    if (updates.archived !== undefined && updates.archived !== this.tasks[index].archived) {
      updatedTask.archivedAt = updates.archived ? new Date().toISOString() : null;
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

  // Time Tracking Methods
  async startTimer(id) {
    await delay(150);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const task = this.tasks[index];
    
    // Stop any other running timers
    this.tasks.forEach((t, i) => {
      if (t.timeTracking?.isRunning && i !== index) {
        this.stopTimer(t.Id);
      }
    });
    
    // Initialize timeTracking if it doesn't exist
    if (!task.timeTracking) {
      task.timeTracking = {
        totalTime: 0,
        sessions: [],
        currentSession: null,
        isRunning: false
      };
    }
    
    // Start new session
    const currentSession = {
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0
    };
    
    task.timeTracking.currentSession = currentSession;
    task.timeTracking.isRunning = true;
    
    return { ...task };
  }

  async stopTimer(id) {
    await delay(150);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const task = this.tasks[index];
    if (!task.timeTracking?.isRunning || !task.timeTracking.currentSession) {
      throw new Error('Timer is not running');
    }
    
    const endTime = new Date().toISOString();
    const startTime = new Date(task.timeTracking.currentSession.startTime);
    const duration = Math.floor((new Date(endTime) - startTime) / 1000);
    
    // Complete the current session
    const completedSession = {
      ...task.timeTracking.currentSession,
      endTime,
      duration
    };
    
    // Add to sessions history
    task.timeTracking.sessions.push(completedSession);
    
    // Update total time
    task.timeTracking.totalTime += duration;
    
    // Reset current session
    task.timeTracking.currentSession = null;
    task.timeTracking.isRunning = false;
    
    return { ...task };
  }

  async pauseTimer(id) {
    await delay(150);
    return this.stopTimer(id); // For simplicity, pause works like stop
  }

  async resetTimer(id) {
    await delay(150);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const task = this.tasks[index];
    
    // Initialize or reset timeTracking
    task.timeTracking = {
      totalTime: 0,
      sessions: [],
      currentSession: null,
      isRunning: false
    };
    
    return { ...task };
  }

  async getTimeSpent(id) {
    await delay(100);
    const task = this.tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) throw new Error('Task not found');
    
    let totalTime = task.timeTracking?.totalTime || 0;
    
    // Add current session time if running
    if (task.timeTracking?.isRunning && task.timeTracking.currentSession) {
      const currentTime = new Date();
      const startTime = new Date(task.timeTracking.currentSession.startTime);
      const currentSessionTime = Math.floor((currentTime - startTime) / 1000);
      totalTime += currentSessionTime;
    }
    
    return totalTime;
  }

formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }

  // Archive Methods
  async getArchivedTasks() {
    await delay(200);
    return this.tasks.filter(t => t.archived === true).map(t => ({ ...t }));
  }

  async archiveTask(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...this.tasks[index],
      archived: true,
      archivedAt: new Date().toISOString()
    };

    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async restoreTask(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...this.tasks[index],
      archived: false,
      archivedAt: null
    };

    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }
}
export default new TaskService();