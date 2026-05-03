import goalDao from '../../dao/goal-dao.js';
import categoryDao from '../../dao/category-dao.js';
import { validateDtoIn } from '../../utils/validator.js';

class ListAbl {
  constructor() {
    this.schema = {
      categoryId: { type: 'string', required: false }
    };
  }

  async execute(dtoIn) {
    // 1. Validace dtoIn
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 2. Business logika
    const itemList = await goalDao.list(dtoIn);
    
    const categories = await categoryDao.list();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat;
    });

    // 3. Return
    return {
      itemList,
      categoryMap,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new ListAbl();
