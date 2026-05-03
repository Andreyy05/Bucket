import categoryDao from '../../dao/category-dao.js';
import { validateDtoIn } from '../../utils/validator.js';

class CategoryListAbl {
  constructor() {
    this.schema = {};
  }

  async execute(dtoIn) {
    // 1. Validace dtoIn
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 2. Business logika
    const itemList = await categoryDao.list();

    // 3. Return
    return {
      itemList,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new CategoryListAbl();
