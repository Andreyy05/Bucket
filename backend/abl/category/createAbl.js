import { v4 as uuidv4 } from 'uuid';
import categoryDao from '../../dao/category-dao.js';
import { validateDtoIn } from '../../utils/validator.js';
import { ErrorMap } from '../../utils/errors.js';

class CategoryCreateAbl {
  constructor() {
    this.schema = {
      name: { type: 'string', required: true },
      icon: { type: 'string', required: true },
      color: { type: 'string', required: true }
    };
  }

  async execute(dtoIn) {
    // 1. Validace dtoIn
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 2. Business logika
    // 2.1 Ověření existence jména
    const existingCategory = await categoryDao.getByName(dtoIn.name);
    if (existingCategory) {
      throw ErrorMap.categoryNameAlreadyExists();
    }

    // 2.2 Vytvoření v DB
    const newCategory = {
      id: uuidv4(),
      name: dtoIn.name,
      icon: dtoIn.icon,
      color: dtoIn.color
    };

    const createdCategory = await categoryDao.create(newCategory);

    // 3. Return
    return {
      ...createdCategory,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new CategoryCreateAbl();
