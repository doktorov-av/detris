export const isDebug = (): boolean => {
    return import.meta.env.MODE === 'development';
}