
export const Utils = {
    // ==================== INPUT MASKS ====================
    applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            input.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 5) {
            input.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            input.value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            input.value = value.replace(/(\d*)/, '$1');
        }
    },

    applyZipCodeMask(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        input.value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    },

    formatCurrency(value) {
        return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`; // Simple formatter, can be improved
    }
};
