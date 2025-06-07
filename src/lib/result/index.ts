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
		if (!this._isOk) throw Error("Result if error!");

		return this._ok!;
	}

	get err() {
		if (this._isOk) throw Error("Result if ok!");

		return this._err!;
	}
}

export type ResultType<T, E> = Result<T, undefined> | Result<undefined, E>;
