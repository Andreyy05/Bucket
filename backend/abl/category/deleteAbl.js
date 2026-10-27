import categoryDao from '../../dao/category-dao.js';
import goalDao from '../../dao/goal-dao.js';
import { validateDtoIn } from '../../utils/validator.js';
import { ErrorMap } from '../../utils/errors.js';

class DeleteAbl {
  constructor() {
    this.schema = {
      id: { type: 'string', required: true }
    };
  }

  async execute(dtoIn) {
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 1. Ověření existence kategorie
    const category = await categoryDao.get(dtoIn.id);
    if (!category) {
      throw ErrorMap.categoryDoesNotExist({ id: dtoIn.id });
    }

    // 2. Ověření, zda kategorie neobsahuje cíle
    const count = await goalDao.countByCategoryId(dtoIn.id);
    if (count > 0) {
      throw ErrorMap.categoryHasGoals({ id: dtoIn.id, count });
    }

    // 3. Smazání kategorie
    await categoryDao.delete(dtoIn.id);

    return {
      success: true,
      deletedId: dtoIn.id,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new DeleteAbl();
