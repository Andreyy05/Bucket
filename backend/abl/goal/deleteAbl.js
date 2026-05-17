import goalDao from '../../dao/goal-dao.js';
import { CustomError } from '../../utils/errors.js';

async function execute(dtoIn) {
  const { id } = dtoIn;

  if (!id) {
    throw new CustomError('MISSING_ID', 'Goal ID is required.', 400);
  }

  const goal = await goalDao.get(id);
  if (!goal) {
    throw new CustomError('GOAL_NOT_FOUND', `Goal with ID ${id} not found.`, 404);
  }

  await goalDao.remove(id);

  return { success: true };
}

export default { execute };
