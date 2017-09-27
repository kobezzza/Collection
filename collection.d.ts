/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

declare namespace CollectionJS {
	type Link = any | any[];
	type AnyMap = Map<any, any>;
	type AnyRecord = Record<string, any>;
	type AnyPromise = Promise<any>;
	type asyncOperation = AnyPromise | (() => AnyPromise);

	interface TRUE {}
	interface FALSE {}

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
		children: AnyPromise;
		destroy();
	}

	type ThreadObj<T> = Promise<T> & {thread: Thread}
	type Single = {mult: false};
	type Async = {async: true} | {thread: true};
	type SingleAsync = Async & Single;

	interface Context {
		readonly true: TRUE;
		readonly false: FALSE;
		readonly reset: FALSE;
		readonly break: FALSE;
		readonly value: any;
		$: AnyRecord;
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
		child(thread: AnyPromise): boolean;
		wait(promise: asyncOperation): AnyPromise;
		wait(max: number, promise: asyncOperation): AnyPromise;
		race(promise: asyncOperation): AnyPromise;
		race(max: number, promise: asyncOperation): AnyPromise;
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
		): ThreadObj<SingleAsyncCollection<T>>;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<number>;

		map<A>(
			params: MapParams<T> & {initial: A}
		): ThreadObj<A>;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): ThreadObj<A>;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): ThreadObj<T>;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<A>;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<any>;

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): ThreadObj<SetReport>;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<Report>;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<any>;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): ThreadObj<T & AnyRecord>;

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
		): ThreadObj<AsyncCollection<T>>;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<number>;

		map<A>(
			params: MapParams<T> & {initial: A}
		): ThreadObj<A>;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): ThreadObj<A>;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): ThreadObj<T>;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<A>;

		get(
			params: BaseParams<T> & Single
		): ThreadObj<any>;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): ThreadObj<any>;

		get(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<any[]>;

		get(
			link?: Link,
			params?: BaseParams<T>
		): any;

		set(
			value: any,
			params: SetParams<T> & Single
		): ThreadObj<SetReport>;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Single
		): ThreadObj<SetReport>;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T>,
			params?: SetParams<T>
		): ThreadObj<SetReport[]>;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			params: BaseParams<T> & Single
		): ThreadObj<Report>;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): ThreadObj<Report>;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<Report[]>;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			params: BaseParams<T> & Single
		): ThreadObj<any>;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Single
		): ThreadObj<any>;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): ThreadObj<any[]>;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): ThreadObj<boolean>;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): ThreadObj<T & AnyRecord>;

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
		): ThreadObj<Collection<T>>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: SingleBaseParams<T> & Async
		): ThreadObj<number>;

		length(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<number>;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map<A>(
			params: MapParams<T> & Async & {initial: A}
		): ThreadObj<A>;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & Async & {initial: A}
		): ThreadObj<A>;

		map<A>(
			params: MapParams<T> & {initial: A}
		): A;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): A;

		map(
			params: MapParams<T> & Async
		): ThreadObj<T>;

		map(
			cb: Callback<T>,
			params: MapParams<T> & Async
		): ThreadObj<T>;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			params: BaseParams<T> & Async
		): ThreadObj<A>;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<A>;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: BaseParams<T> & Async
		): ThreadObj<any>;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<any>;

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
		): ThreadObj<SetReport>;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Async
		): ThreadObj<SetReport>;

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
		): ThreadObj<Report>;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<Report>;

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
		): ThreadObj<any>;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<any>;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any;

		includes(
			searchElement: any,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: any,
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		every(
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		every(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		some(
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		some(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: GroupParams<T> & Async & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): AnyMap;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): AnyMap;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): AnyRecord;

		extend(
			params: ExtendParams<T> & Async,
			...source: any[]
		): ThreadObj<T & AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T & AnyRecord;

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
		): ThreadObj<Collection<T>>;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: SingleBaseParams<T> & Async
		): ThreadObj<number>;

		length(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<number>;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map<A>(
			params: MapParams<T> & Async & {initial: A}
		): ThreadObj<A>;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & Async & {initial: A}
		): ThreadObj<A>;

		map<A>(
			params: MapParams<T> & {initial: A}
		): A;

		map<A>(
			cb: Callback<T>,
			params: MapParams<T> & {initial: A}
		): A;

		map(
			params: MapParams<T> & Async
		): ThreadObj<T>;

		map(
			cb: Callback<T>,
			params: MapParams<T> & Async
		): ThreadObj<T>;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			params: BaseParams<T> & Async
		): ThreadObj<A>;

		reduce<A>(
			cb: ReduceCallback<T>,
			initialValue: A,
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<A>;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: BaseParams<T> & SingleAsync
		): ThreadObj<any>;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): ThreadObj<any>;

		get(
			params: BaseParams<T> & Async
		): ThreadObj<any[]>;

		get(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<any[]>;

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
		): ThreadObj<SetReport>;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & SingleAsync
		): ThreadObj<SetReport>;

		set(
			value: any,
			params: SetParams<T> & Async
		): ThreadObj<SetReport[]>;

		set(
			value: any,
			filter: Filter<T>,
			params: SetParams<T> & Async
		): ThreadObj<SetReport[]>;

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
		): ThreadObj<Report>;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): ThreadObj<Report>;

		remove(
			params: BaseParams<T> & Async
		): ThreadObj<Report[]>;

		remove(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<Report[]>;

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
		): ThreadObj<any>;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & SingleAsync
		): ThreadObj<any>;

		search(
			params: BaseParams<T> & Async
		): ThreadObj<any[]>;

		search(
			filter: Filter<T>,
			params: BaseParams<T> & Async
		): ThreadObj<any[]>;

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
		): ThreadObj<boolean>;

		includes(
			searchElement: any,
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		every(
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		every(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		some(
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		some(
			filter: Filter<T>,
			params: SingleBaseParams<T> & Async
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: GroupParams<T> & Async & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async & {useMap: true}
		): ThreadObj<AnyMap>;

		group(
			field: any,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: any,
			params: GroupParams<T> & {useMap: true}
		): AnyMap;

		group(
			field: any,
			filter: Filter<T>,
			params: GroupParams<T> & {useMap: true}
		): AnyMap;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): AnyRecord;

		extend(
			params: ExtendParams<T> & Async,
			...source: any[]
		): ThreadObj<T & AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T & AnyRecord;

		link(link: CollectionJS.Link): boolean;
	}
}

declare const $C: {
	<T>(collection: T): CollectionJS.Collection<T>;

	extend<T>(
		params: CollectionJS.ExtendParams<T> & CollectionJS.Async,
		target?: T,
		...source: any[]
	): CollectionJS.ThreadObj<T & CollectionJS.AnyRecord>;

	extend<T>(
		deepOrParams: boolean | CollectionJS.ExtendParams<T>,
		target?: T,
		...source: any[]
	): T & CollectionJS.AnyRecord;

	clone(source: any): any;
	in(link: CollectionJS.Link, target: any): boolean;
};

declare module 'collection.js' {
	export = $C;
}
