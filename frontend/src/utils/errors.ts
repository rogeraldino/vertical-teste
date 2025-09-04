// Converte respostas variadas do backend em uma mensagem amigável.
export function apiErrorMessage(err: any, fallback = 'Ops, algo deu errado.') {
    // Falhas de rede
    if (err?.message === 'Network Error') return 'Sem conexão com o servidor.';
    const status = err?.response?.status;
    const data = err?.response?.data;

    // String crua do backend
    if (typeof data === 'string') return data;

    // Formatos comuns
    if (data?.error) return String(data.error);
    if (data?.message) return String(data.message);

    // Zod flatten (caso use o middleware sugerido)
    const fieldErrors = data?.details?.fieldErrors as Record<string, string[]> | undefined;
    if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        const firstMsg = firstKey ? fieldErrors[firstKey][0] : undefined;
        if (firstMsg) return firstMsg;
    }

    // Lista de erros
    if (Array.isArray(data?.errors) && data.errors.length) {
        const e0 = data.errors[0];
        if (typeof e0 === 'string') return e0;
        if (e0?.message) return e0.message;
    }

    // Fallback por status
    switch (status) {
        case 400: return 'Dados inválidos.';
        case 401: return 'Credenciais inválidas.';
        case 403: return 'Acesso negado.';
        case 404: return 'Recurso não encontrado.';
        case 409: return 'Conflito de dados.';
        case 422: return 'Entradas inválidas.';
        case 500: return 'Erro interno no servidor.';
        default:  return fallback;
    }
}
