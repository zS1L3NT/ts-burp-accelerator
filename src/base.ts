export const USERNAMES = [
	"carlos",
	"root",
	"admin",
	"test",
	"guest",
	"info",
	"adm",
	"mysql",
	"user",
	"administrator",
	"oracle",
	"ftp",
	"pi",
	"puppet",
	"ansible",
	"ec2-user",
	"vagrant",
	"azureuser",
	"academico",
	"acceso",
	"access",
	"accounting",
	"accounts",
	"acid",
	"activestat",
	"ad",
	"adam",
	"adkit",
	"admin",
	"administracion",
	"administrador",
	"administrator",
	"administrators",
	"admins",
	"ads",
	"adserver",
	"adsl",
	"ae",
	"af",
	"affiliate",
	"affiliates",
	"afiliados",
	"ag",
	"agenda",
	"agent",
	"ai",
	"aix",
	"ajax",
	"ak",
	"akamai",
	"al",
	"alabama",
	"alaska",
	"albuquerque",
	"alerts",
	"alpha",
	"alterwind",
	"am",
	"amarillo",
	"americas",
	"an",
	"anaheim",
	"analyzer",
	"announce",
	"announcements",
	"antivirus",
	"ao",
	"ap",
	"apache",
	"apollo",
	"app",
	"app01",
	"app1",
	"apple",
	"application",
	"applications",
	"apps",
	"appserver",
	"aq",
	"ar",
	"archie",
	"arcsight",
	"argentina",
	"arizona",
	"arkansas",
	"arlington",
	"as",
	"as400",
	"asia",
	"asterix",
	"at",
	"athena",
	"atlanta",
	"atlas",
	"att",
	"au",
	"auction",
	"austin",
	"auth",
	"auto",
	"autodiscover",
] as const

export const PASSWORDS = [
	"123456",
	"password",
	"12345678",
	"qwerty",
	"123456789",
	"12345",
	"1234",
	"111111",
	"1234567",
	"dragon",
	"123123",
	"baseball",
	"abc123",
	"football",
	"monkey",
	"letmein",
	"shadow",
	"master",
	"666666",
	"qwertyuiop",
	"123321",
	"mustang",
	"1234567890",
	"michael",
	"654321",
	"superman",
	"1qaz2wsx",
	"7777777",
	"121212",
	"000000",
	"qazwsx",
	"123qwe",
	"killer",
	"trustno1",
	"jordan",
	"jennifer",
	"zxcvbnm",
	"asdfgh",
	"hunter",
	"buster",
	"soccer",
	"harley",
	"batman",
	"andrew",
	"tigger",
	"sunshine",
	"iloveyou",
	"2000",
	"charlie",
	"robert",
	"thomas",
	"hockey",
	"ranger",
	"daniel",
	"starwars",
	"klaster",
	"112233",
	"george",
	"computer",
	"michelle",
	"jessica",
	"pepper",
	"1111",
	"zxcvbn",
	"555555",
	"11111111",
	"131313",
	"freedom",
	"777777",
	"pass",
	"maggie",
	"159753",
	"aaaaaa",
	"ginger",
	"princess",
	"joshua",
	"cheese",
	"amanda",
	"summer",
	"love",
	"ashley",
	"nicole",
	"chelsea",
	"biteme",
	"matthew",
	"access",
	"yankees",
	"987654321",
	"dallas",
	"austin",
	"thunder",
	"taylor",
	"matrix",
	"mobilemail",
	"mom",
	"monitor",
	"monitoring",
	"montana",
	"moon",
	"moscow",
] as const

export class Sess {
	history = [] as Res[]
	constructor(private cookies = [] as string[]) {}

	static async req(literal: TemplateStringsArray, ...args: any[]) {
		return new Sess().req(literal, ...args)
	}

	async req(literal: TemplateStringsArray, ...args: any[]) {
		const lines = literal
			.reduce<string[]>((r, v, i) => r.concat(v, args[i] || []), [])
			.join("")
			.trim()
			.split("\n")
		if (!lines.length) throw new Error("Empty request string!")

		const [method, path] = lines.shift()!.trim().split(" ")

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
		
		let url: URL
		try {
			url = new URL(path ?? "")
		} catch {
			url = new URL(`https://${headers.Host || headers.host}${path}`)
		}

		const req = await fetch(url, {
			method,
			headers,
			body: method!.toLowerCase() === "get" ? undefined : body,
			redirect: "manual",
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
		return [...this.res.headers.entries()].find(
			([k]) => k.toLowerCase() === key.toLowerCase(),
		)?.[1]
	}

	cookies(): string[] {
		return (
			[this.header("set-cookie")!]
				.flat()
				.filter(Boolean)
				.map(c => c.split(";")[0]!) ?? []
		)
	}

	body() {
		return this.text
	}

	bodreg(regexp: RegExp) {
		return this.text.match(regexp)?.slice(1)
	}
}
