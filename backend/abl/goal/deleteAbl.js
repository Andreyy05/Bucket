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
    // 1. Validace dtoIn
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 2. Business logika
    // 2.1 Ověření existence
    const goal = await goalDao.get(dtoIn.id);
    if (!goal) {
      throw ErrorMap.goalDoesNotExist({ id: dtoIn.id });
    }

    // 2.2 Smazání přes DAO
    await goalDao.delete(dtoIn.id);

    // 3. Return
    return {
      success: true,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new DeleteAbl();
