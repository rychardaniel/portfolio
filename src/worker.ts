import {
	buildFallbackContributions,
	normalizeContributionWeeks,
	type GithubContributionWeek,
} from './lib/githubContributions'

interface Env {
	ASSETS: {
		fetch: (request: Request) => Promise<Response>
	}
	GITHUB_TOKEN?: string
	GITHUB_USERNAME?: string
}

interface WorkerExecutionContext {
	waitUntil: (promise: Promise<unknown>) => void
}

interface GithubGraphqlResponse {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: {
					totalContributions?: number
					weeks?: GithubContributionWeek[]
				}
			}
		}
	}
	errors?: Array<{ message: string }>
}

const CONTRIBUTIONS_PATH = '/api/github/contributions'
const CACHE_SECONDS = 60 * 60 * 6

export default {
	async fetch(request: Request, env: Env, ctx: WorkerExecutionContext) {
		const url = new URL(request.url)

		if (url.pathname === CONTRIBUTIONS_PATH) {
			return handleGithubContributions(request, env, ctx)
		}

		return env.ASSETS.fetch(request)
	},
}

async function handleGithubContributions(request: Request, env: Env, ctx: WorkerExecutionContext) {
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders() })
	}

	if (request.method !== 'GET') {
		return json({ error: 'method not allowed' }, 405)
	}

	const username = env.GITHUB_USERNAME ?? 'rychardaniel'
	const cacheKey = new Request(new URL(CONTRIBUTIONS_PATH, request.url), request)
	const cache = (caches as CacheStorage & { default: Cache }).default
	const cached = await cache.match(cacheKey)

	if (cached) {
		return cached
	}

	const response = env.GITHUB_TOKEN
		? await fetchGithubContributions(username, env.GITHUB_TOKEN)
		: buildFallbackContributions(username)

	const apiResponse = json(response, 200, {
		'Cache-Control': `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
	})

	ctx.waitUntil(cache.put(cacheKey, apiResponse.clone()))

	return apiResponse
}

async function fetchGithubContributions(username: string, token: string) {
	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'rychard-portfolio',
			},
			body: JSON.stringify({
				query: `
					query UserContributions($login: String!) {
						user(login: $login) {
							contributionsCollection {
								contributionCalendar {
									totalContributions
									weeks {
										firstDay
										contributionDays {
											date
											contributionCount
											color
										}
									}
								}
							}
						}
					}
				`,
				variables: { login: username },
			}),
		})

		if (!response.ok) {
			return buildFallbackContributions(username)
		}

		const payload = (await response.json()) as GithubGraphqlResponse
		const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar

		if (!calendar?.weeks || payload.errors?.length) {
			return buildFallbackContributions(username)
		}

		return normalizeContributionWeeks(
			username,
			calendar.weeks,
			calendar.totalContributions ?? 0,
			'github',
		)
	} catch {
		return buildFallbackContributions(username)
	}
}

function json(body: unknown, status = 200, headers?: HeadersInit) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			...corsHeaders(),
			...headers,
		},
	})
}

function corsHeaders() {
	return {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	}
}
