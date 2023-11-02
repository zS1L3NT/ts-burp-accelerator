export class Sess {
	history = [] as Res[]
	constructor(private cookies = [] as string[]) {}

	req = async (request: string) => {
		const lines = request.trim().split("\n")
		if (!lines.length) throw new Error("Empty request string!")

		const [method, url] = lines.shift()!.trim().split(" ")

		let i = 0
		const headers = {} as Record<string, string>
		for (; i < lines.length; i++) {
			const line = lines[i]!.trim()
			if (!line) break

			const [key, ...values] = line.split(":")
			headers[key!] = values.join(":").trim()
		}

		if ("Cookie" in headers) {
			headers.Cookie = [...this.cookies, headers.Cookie].join("; ")
		} else if ("cookie" in headers) {
			headers.cookie = [...this.cookies, headers.cookie].join("; ")
		} else {
			headers.Cookie = this.cookies.join("; ")
		}

		let body = lines
			.slice(++i)
			.map(l => l.trim())
			.join("\n")
			.trim()

		const req = await fetch(url!, {
			method,
			headers,
			body,
		})

		const res = new Res(req, await req.text())

		this.history.push(res)
		this.cookies.push(...res.cookies())

		return res
	}
}

export class Res {
	constructor(
		private res: Response,
		private text: string,
	) {}

	get raw() {
		return this.res
	}

	status() {
		return this.res.status
	}

	headers() {
		return this.res.headers
	}

	header(key: string): string | string[] | undefined {
		return Object.entries(this.res.headers.toJSON()).find(
			([k]) => k.toLowerCase() === key.toLowerCase(),
		)?.[1]
	}

	cookies(): string[] {
		return (this.header("set-cookie") as string[])?.map(c => c.split(";")[0]!) ?? []
	}

	body() {
		return this.text
	}

	bodreg(regexp: RegExp) {
		return this.text.match(regexp)?.slice(1)
	}
}
