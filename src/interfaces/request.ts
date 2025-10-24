// Resultado de sucesso de uma requisição
export interface HandleRequestResultSuccess<R> {
  success: true; // Literal true para discriminador
  data: R; // Dados retornados
}

// Resultado de erro de uma requisição
export interface HandleRequestResultError {
  success: false; // Literal false para discriminador
  error: {
    name: string; // Nome do erro
    code: number; // Código do erro (ex: HTTP status)
    message: any; // Mensagem amigável
  };
}

// Tipo genérico que pode ser sucesso ou erro
export type HandleRequestResult<R> =
  | HandleRequestResultSuccess<R>
  | HandleRequestResultError;
