import goalDao from '../../dao/goal-dao.js';
import categoryDao from '../../dao/category-dao.js';
import { validateDtoIn } from '../../utils/validator.js';
import { ErrorMap } from '../../utils/errors.js';

class UpdateAbl {
  constructor() {
    this.schema = {
      id: { type: 'string', required: true },
      title: { type: 'string', required: false },
      state: { type: 'string', required: false },
      categoryId: { type: 'string', required: false },
      deadline: { type: 'string', required: false },
      notes: { type: 'string', required: false },
      priority: { type: 'number', required: false },
      subtasks: { type: 'array', required: false },
      imageUrl: { type: 'string', required: false },
      budget: { type: 'number', required: false },
      rating: { type: 'number', required: false },
      reflection: { type: 'string', required: false },
      location: { type: 'string', required: false }
    };
  }

  async execute(dtoIn) {
    // 1. Validace dtoIn
    const { warnings } = validateDtoIn(dtoIn, this.schema);

    // 2. Business logika
    // 2.1 Ověření existence cíle
    const goal = await goalDao.get(dtoIn.id);
    if (!goal) {
      throw ErrorMap.goalDoesNotExist({ id: dtoIn.id });
    }

    // 2.2 Pokud se mění kategorie, ověřit existenci nové kategorie
    if (dtoIn.categoryId && dtoIn.categoryId !== goal.categoryId) {
      const category = await categoryDao.get(dtoIn.categoryId);
      if (!category) {
        throw ErrorMap.categoryDoesNotExist({ categoryId: dtoIn.categoryId });
      }
    }

    // 2.3 Automaticky nastavit completedAt při dokončení
    const updateData = { ...dtoIn };
    if (dtoIn.state === 'completed' && goal.state !== 'completed') {
      updateData.completedAt = Date.now();
    } else if (dtoIn.state === 'active' && goal.state === 'completed') {
      updateData.completedAt = null;
    }

    // 2.4 Update přes DAO
    await goalDao.update(updateData);

    // 2.5 Načíst aktuální stav z DB pro návrat
    const updatedGoal = await goalDao.get(dtoIn.id);

    // 3. Return
    return {
      ...updatedGoal,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new UpdateAbl();
