export const validateTodo = (data) => {
    const errors = {};

    if (!data.title || data.title.length < 3) {
        errors.title = 'Minimum 3 caractères';
    }

    if (data.description && data.description.length > 100) {
        errors.description = 'Maximum 100 caractères';
    }

    if (data.priority < 1 || data.priority > 5) {
        errors.priority = 'Valeur entre 1 et 5';
    }

    return errors;
};