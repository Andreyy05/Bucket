import categoryDao from '../../dao/category-dao.js';
import goalDao from '../../dao/goal-dao.js';

class ExportAbl {
  async execute() {
    const categories = await categoryDao.list();
    const goals = await goalDao.list();

    return {
      version: 1,
      appName: 'Bucket',
      exportedAt: new Date().toISOString(),
      categories,
      goals
    };
  }
}

export default new ExportAbl();
