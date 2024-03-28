export const isIntegerNumber = (val: string) => {
    return /^-?[0-9]*$/.test(val);
};

export const isFloatNumber = (val: string) => {
    return /^-?[0-9]*[.,]?[0-9]*$/.test(val);
};
