/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

declare namespace CollectionJS {
	type Link = any | any[];
	type HashTable = Record<string, any>;
	type asyncOperation = Promise<any> | (() => Promise<any>);

	interface TRUE {

	}

	interface FALSE {

	}

	interface Info {
		filters: Function[];
		mult: number | false;
		startIndex: number | false;
		endIndex: number | false;
		from: number | false;
		count: number | false;
		live: boolean;
		reverse: boolean;
		withDescriptor: boolean;
		notOwn: boolean | -1;
		inverseFilter: boolean;
		type: string;
		async: boolean;
		thread: boolean;
		priority: string | false;
		length: boolean;
	}

	interface Thread {
		thread: boolean;
		priority: string;
		onComplete?: Function;
		onChunk?: Function;
		pause: boolean;
		sleep: any;
		children: Promise<any>;
		destroy();
	}

	type ThreadObj = {
		thread: Thread
	};

	type Single = {
		mult: false
	};

	type Async = {async: true} | {thread: true};
	type SingleAsync = Async & Single;

	interface Context {
		readonly true: TRUE;
		readonly false: FALSE;
		readonly reset: FALSE;
		readonly break: FALSE;
		readonly value: any;
		$: HashTable;
		info: Info;
		result: any;
		childResult: any[];
		thread: Thread | undefined;
		onError: (err: Error) => void;
		length(reset?: boolean): number | Promise<number>;
		i(value?: number): number | false;
		jump(value: number): number | false;
		yield(value: any): boolean;
		next(value: any): boolean;
		child(thread: Promise<any>): boolean;
		wait(promise: asyncOperation): Promise<any>;
		wait(max: number, promise: asyncOperation): Promise<any>;
		race(promise: asyncOperation): Promise<any>;
		race(max: number, promise: asyncOperation): Promise<any>;
		sleep(time: number, test?: (ctx: Context) => any, interval?: boolean): Promise<void>;
	}

	interface Callback<T> {
		(item: any, index: any, collection: T, context: Context): any;
	}

	interface EventCallback {
		(context: Context): any;
	}

	type Filter<T> = Array<Callback<T>> | Callback<T>;
	interface SingleBaseParams<T> {
		filter?: Filter<T>;
		count?: number;
		from?: number;
		startIndex?: number;
		endIndex?: number;
		reverse?: boolean;
		inverseFilter?: boolean;
		withDescriptor?: boolean;
		notOwn?: boolean | number;
		live?: boolean;
		use?: string;
		length?: boolean;
		async?: boolean;
		thread?: boolean;
		priority?: string;
		onChunk?: EventCallback;
		onIterationEnd?: EventCallback;
	}

	interface Report {
		result: Boolean;
		key: any;
		value: any;
		notFound?: boolean;
	}

	interface SetReport extends Report {
		newValue: any;
	}

	interface BaseParams<T> extends SingleBaseParams<T> {
		mult?: boolean;
	}

	interface ForEachParams<T> extends BaseParams<T> {
		result?: any;
	}

	interface MapParams<T> extends BaseParams<T> {
		initial?: any;
	}

	interface SetParams<T> extends BaseParams<T> {
		create?: boolean;
	}

	interface GroupParams<T> extends SingleBaseParams<T> {
		useMap?: boolean;
		saveKeys?: boolean;
	}

	interface ExtendParams<T> extends SingleBaseParams<T> {
		deep?: boolean,
		traits?: boolean,
		withDescriptor?: boolean,
		withAccessors?: boolean,
		withProto?: boolean,
		concatArray?: boolean,
		concatFn?: (...arrays: any[]) => any[]
	}

	interface ReduceCallback<T> {
		(
			result: any,
			item: any,
			index: any,
			collection: T,
			context: Context
		): boolean | any;
	}

	interface SingleAsyncCollection<T> {
		array: SingleAsyncCollection<T>;
		iterator: SingleAsyncCollection<T>;
		live: SingleAsyncCollection<T>;
		descriptor: SingleAsyncCollection<T>;
		inverse: SingleAsyncCollection<T>;
		reverse: SingleAsyncCollection<T>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollection<T>;

		filter(...filters: Array<Filter<T>>): SingleAsyncCollection<T>;
		start(value: number): SingleAsyncCollection<T>;
		end(value: number): SingleAsyncCollection<T>;
		from(value: number): SingleAsyncCollection<T>;
		object(notOwn: boolean | -1): SingleAsyncCollection<T>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Promise<SingleAsyncCollection<T>> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<number> & ThreadObj;

		map<A>(
			params: MapParams<T> & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): Promise<A> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): Promise<T> & ThreadObj;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<A> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any> & ThreadObj;

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<Report> & ThreadObj;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): Promise<T> & ThreadObj;

		link(link: CollectionJS.Link): boolean;
	}

	interface AsyncCollection<T> {
		array: AsyncCollection<T>;
		iterator: AsyncCollection<T>;
		live: AsyncCollection<T>;
		one: SingleAsyncCollection<T>;
		descriptor: AsyncCollection<T>;
		inverse: AsyncCollection<T>;
		reverse: AsyncCollection<T>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollection<T>;

		filter(...filters: Array<Filter<T>>): AsyncCollection<T>;
		start(value: number): AsyncCollection<T>;
		end(value: number): AsyncCollection<T>;
		count(value: number): AsyncCollection<T>;
		from(value: number): AsyncCollection<T>;
		object(notOwn: boolean | -1): AsyncCollection<T>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Promise<AsyncCollection<T>> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<number> & ThreadObj;

		map<A>(
			params: MapParams<T> & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): Promise<A> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): Promise<T> & ThreadObj;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<A> & ThreadObj;

		get(
			params: BaseParams<T> & Single
		): Promise<any> & ThreadObj;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any[]> & ThreadObj;

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			params: SetParams<T> & Single
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Single
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): Promise<SetReport[]> & ThreadObj;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			params: BaseParams<T> & Single
		): Promise<Report> & ThreadObj;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): Promise<Report> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<Report[]> & ThreadObj;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			params: BaseParams<T> & Single
		): Promise<any> & ThreadObj;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): Promise<any> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any[]> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): Promise<T> & ThreadObj;

		link(link: CollectionJS.Link): boolean;
	}

	interface SingleCollection<T> {
		array: SingleCollection<T>;
		iterator: SingleCollection<T>;
		live: SingleCollection<T>;
		descriptor: SingleCollection<T>;
		inverse: SingleCollection<T>;
		reverse: SingleCollection<T>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleCollection<T>;

		filter(...filters: Array<Filter<T>>): SingleCollection<T>;
		start(value: number): SingleCollection<T>;
		end(value: number): SingleCollection<T>;
		from(value: number): SingleCollection<T>;
		object(notOwn: boolean | -1): SingleCollection<T>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T> & Async
		): Promise<Collection<T>> & ThreadObj;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: SingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map<A>(
			params: MapParams<T> & Async & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & Async & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			params: MapParams<T> & {initial: A}
		): A;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): A;

		map(
			params: MapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb: Callback<T>,
			params: MapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			params: BaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: BaseParams<T> & Async
		): Promise<any> & ThreadObj;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any;

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			params: SetParams<T> & Async
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Async
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): SetReport;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			params: BaseParams<T> & Async
		): Promise<Report> & ThreadObj;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<Report> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Report;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			params: BaseParams<T> & Async
		): Promise<any> & ThreadObj;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<any> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any;

		includes(
			searchElement: any,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		every(
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		some(
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: GroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): Map<any, any>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): Map<any, any>;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): HashTable;

		extend(
			params: ExtendParams<T> & Async,
			...source: any[]
		): Promise<T> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T;

		link(link: CollectionJS.Link): boolean;
	}

	interface Collection<T> {
		array: Collection<T>;
		iterator: Collection<T>;
		live: Collection<T>;
		one: SingleCollection<T>;
		descriptor: Collection<T>;
		inverse: Collection<T>;
		reverse: Collection<T>;
		async: AsyncCollection<T>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollection<T>;

		filter(...filters: Array<Filter<T>>): Collection<T>;
		start(value: number): Collection<T>;
		end(value: number): Collection<T>;
		count(value: number): Collection<T>;
		from(value: number): Collection<T>;
		object(notOwn: boolean | -1): Collection<T>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T> & Async
		): Promise<Collection<T>> & ThreadObj;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: SingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map<A>(
			params: MapParams<T> & Async & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & Async & {initial: A}
		): Promise<A> & ThreadObj;

		map<A>(
			params: MapParams<T> & {initial: A}
		): A;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): A;

		map(
			params: MapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb: Callback<T>,
			params: MapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			params: BaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: BaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		get(
			params: BaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		get(
			params: BaseParams<T> & Single
		): any;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): any;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any[];

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			params: SetParams<T> & SingleAsync
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & SingleAsync
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			params: SetParams<T> & Async
		): Promise<SetReport[]> & ThreadObj;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Async
		): Promise<SetReport[]> & ThreadObj;

		set(
			value: any,
			params: SetParams<T> & Single
		): SetReport;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Single
		): SetReport;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): SetReport[];

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			params: BaseParams<T> & SingleAsync
		): Promise<Report> & ThreadObj;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): Promise<Report> & ThreadObj;

		remove(
			params: BaseParams<T> & Async
		): Promise<Report[]> & ThreadObj;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<Report[]> & ThreadObj;

		remove(
			params: BaseParams<T> & Single
		): Report;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): Report;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Report[];

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			params: BaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		search(
			params: BaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		search(
			params: BaseParams<T> & Single
		): any;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): any;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any[];

		includes(
			searchElement: any,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		every(
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		some(
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: GroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): Promise<HashTable> & ThreadObj;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): Map<any, any>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): Map<any, any>;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): HashTable;

		extend(
			params: ExtendParams<T> & Async,
			...source: any[]
		): Promise<T & HashTable> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T & HashTable;

		link(link: CollectionJS.Link): boolean;
	}
}

declare const $C: {
	<T>(collection: T): CollectionJS.Collection<T>;

	extend<T>(
		params: CollectionJS.ExtendParams<T> & CollectionJS.Async,
		target?: T,
		...source: any[]
	): Promise<T & CollectionJS.HashTable> & CollectionJS.ThreadObj;

	extend<T>(
		deepOrParams: boolean | CollectionJS.ExtendParams<T>,
		target?: T,
		...source: any[]
	): T & CollectionJS.HashTable;

	clone(source: any): any;
	in(link: CollectionJS.Link, target: any): boolean;
};

declare module 'collection.js' {
	export = $C;
}
