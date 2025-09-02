export class ResultError<T> extends Error {
	cause: T;

	constructor(cause: T) {
		super("An attempt to extract data from the result when it is an error!");

		this.name = "ResultError";
		this.cause = cause;
	}
}

export class Result<T, E> {
	private constructor(
		private _isOk: boolean,
		private _ok?: T,
		private _err?: E
	) {}

	static ok<T>(value: T) {
		return new Result(true, value, undefined);
	}

	static err<E>(value: E) {
		return new Result(false, undefined, value);
	}

	isOk() {
		return this._isOk;
	}

	isErr() {
		return !this._isOk;
	}

	get ok() {
		if (!this._isOk) throw new ResultError(this._err!);

		return this._ok!;
	}

	get err() {
		if (this._isOk) throw Error("Result is ok!");

		return this._err!;
	}
}

export type ResultType<T, E> = Result<T, undefined> | Result<undefined, E>;
