import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(150);
    const category = this.categories.find(c => c.Id === parseInt(id, 10));
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      name: categoryData.name,
      color: categoryData.color || '#6b7280',
      icon: categoryData.icon || 'Folder',
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = {
      ...this.categories[index],
      ...updates,
      Id: this.categories[index].Id // Preserve Id
    };

    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Category not found');
    
    const deleted = this.categories.splice(index, 1)[0];
    return { ...deleted };
  }

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const category = this.categories.find(c => c.Id === parseInt(categoryId, 10));
    if (category) {
      category.taskCount = count;
    }
  }
}

export default new CategoryService();