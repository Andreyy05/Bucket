import goalDao from '../../dao/goal-dao.js';
import { validateDtoIn } from '../../utils/validator.js';
import { ErrorMap } from '../../utils/errors.js';

class UpdateAbl {
  constructor() {
    this.schema = {
      id: { type: 'string', required: true },
      title: { type: 'string', required: false },
      state: { type: 'string', required: false }
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

    // 2.3 Update
    const updatedGoal = await goalDao.update({ ...dtoIn });

    // 3. Return
    return {
      ...updatedGoal,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new UpdateAbl();
