import { glob, type ParseDataOptions } from "astro/loaders";

type Parser = <TData extends Record<string, unknown>>(
	options: ParseDataOptions<TData>
) => Promise<ParseDataOptions<TData>>;
type GlobWithParserOptions = Parameters<typeof glob>[0] & {
	parser: Parser,
};

export function globWithParser({
	parser,
	...globOptions }: GlobWithParserOptions)
{
	const loader = glob(globOptions);
	const originalLoad = loader.load;

	loader.load = async ({ parseData, ...rest }) => originalLoad({
		parseData: async (entry) => parseData(await parser(entry)),
		...rest
	});

	return loader;
}
