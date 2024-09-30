// polyfill for Object.groupBy, which is not supported in node < 21
Object.groupBy ??= function groupBy<K extends PropertyKey, T>(
	iterable: Iterable<T>,
	callback: (item: T, index: number) => K): Partial<Record<K, T[]>>
{
	const result = Object.create(null);
	let i = 0;

	for (const value of iterable) {
		const key = callback(value, i++);

		result[key] ??= [];
		result[key].push(value);
	}

	return result;
};
