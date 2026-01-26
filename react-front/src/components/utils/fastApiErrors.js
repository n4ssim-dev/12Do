export const parseFastApiErrors = (details) => {
    const errors = {};

    if (!Array.isArray(details)) {
        return errors;
    }

    details.forEach(err => {
        const field = err.loc?.[1];
        if (!field) return;

        switch (err.type) {
            case 'string_too_short':
                errors[field] = `Minimum ${err.ctx?.min_length} caractères`;
                break;

            case 'string_too_long':
                errors[field] = `Maximum ${err.ctx?.max_length} caractères`;
                break;

            case 'greater_than':
                errors[field] = `Doit être supérieur à ${err.ctx?.gt}`;
                break;

            case 'less_than':
                errors[field] = `Doit être inférieur à ${err.ctx?.lt}`;
                break;

            case 'value_error.missing':
                errors[field] = 'Champ obligatoire';
                break;

            default:
                errors[field] = err.msg;
        }
    });

    return errors;
};
