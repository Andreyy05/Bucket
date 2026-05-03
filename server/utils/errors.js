export class CustomError extends Error {
  constructor(code, message, params = {}) {
    super(message);
    this.code = code;
    this.params = params;
    this.status = 400; // default for validations
  }
}

export const ErrorMap = {
  invalidDtoIn: (params) => new CustomError('invalidDtoIn', 'Vstupní data nesplňují předepsané schéma.', params),
  categoryDoesNotExist: (params) => new CustomError('categoryDoesNotExist', 'Kategorie se zadaným ID nebyla nalezena.', params),
  goalDoesNotExist: (params) => new CustomError('goalDoesNotExist', 'Cíl se zadaným ID nebyl nalezen.', params),
  categoryNameAlreadyExists: (params) => new CustomError('categoryNameAlreadyExists', 'Kategorie s tímto názvem již existuje.', params),
};
