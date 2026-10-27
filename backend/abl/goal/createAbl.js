import { v4 as uuidv4 } from 'uuid';
import categoryDao from '../../dao/category-dao.js';
import goalDao from '../../dao/goal-dao.js';
import { validateDtoIn } from '../../utils/validator.js';
import { ErrorMap } from '../../utils/errors.js';

class CreateAbl {
  constructor() {
    this.schema = {
      title: { type: 'string', required: true },
      categoryId: { type: 'string', required: true },
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
    // 2.1 Ověření existence kategorie
    const category = await categoryDao.get(dtoIn.categoryId);
    
    // 2.2 Zpracování categoryDoesNotExist chyby
    if (!category) {
      throw ErrorMap.categoryDoesNotExist({ categoryId: dtoIn.categoryId });
    }

    // 2.3 Vytvoření cíle pomocí DAO
    const newGoal = {
      id: uuidv4(),
      title: dtoIn.title,
      categoryId: dtoIn.categoryId,
      state: 'active',
      createdAt: Date.now(),
      deadline: dtoIn.deadline || null,
      notes: dtoIn.notes || '',
      priority: dtoIn.priority || 0,
      subtasks: dtoIn.subtasks || [],
      imageUrl: dtoIn.imageUrl || null,
      budget: dtoIn.budget !== undefined ? dtoIn.budget : null,
      rating: dtoIn.rating !== undefined ? dtoIn.rating : null,
      reflection: dtoIn.reflection || '',
      location: dtoIn.location || ''
    };

    const createdGoal = await goalDao.create(newGoal);

    // 3. Návrat objektu
    return {
      ...createdGoal,
      uuAppErrorMap: warnings.length > 0 ? { warnings } : {}
    };
  }
}

export default new CreateAbl();
