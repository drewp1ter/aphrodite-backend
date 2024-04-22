type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type RequiredBy<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>