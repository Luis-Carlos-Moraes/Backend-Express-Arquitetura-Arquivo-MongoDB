/**
 * Erro de domínio com semântica HTTP.
 * Services lançam AppError; o errorHandler traduz para o envelope
 * { error: { code, message, details? } }.
 */
class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    if (details !== undefined) this.details = details;
    if (Error.captureStackTrace) Error.captureStackTrace(this, AppError);
  }
}

module.exports = AppError;
