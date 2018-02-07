/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/// <reference types="node"/>

declare namespace CollectionJS {
	type Link = any | any[];
	type AnyMap = Map<any, any>;
	type AnyRecord = Record<any, any>;
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

	type Thread = Generator & {
		thread: boolean;
		priority: string;
		onComplete?: Function;
		onChunk?: Function;
		pause: boolean;
		sleep: any;
		children: AnyPromise;
		destroy<E extends Object = Error>(err?: E): E & {type: 'CollectionThreadDestroy'; thread: Thread} | false;
	};

	type ThreadObj<T> = Promise<T> & {thread: Thread};
	type Single = {mult: false};
	type Async = {async: true} | {thread: true};
	type SingleAsync = Async & Single;

	interface Context {
		readonly true: TRUE;
		readonly false: FALSE;
		readonly reset: FALSE;
		readonly break: FALSE;
		readonly value: any;
		readonly id: number;
		readonly cursor: NodeJS.ReadableStream | IDBRequest | undefined;
		readonly thread: Thread | undefined;
		readonly childResult: any[];
		readonly info: Readonly<Info>;
		result: any;
		$: AnyRecord;
		onError: (err: Error) => void;
		length(reset?: boolean): number | Promise<number>;
		i(value?: number): number | false;
		jump(value: number): number | false;
		yield(value: any): boolean;
		next(value: any): boolean;
		child(thread: AnyPromise): boolean;
		wait(promise: asyncOperation): AnyPromise;
		wait(max: number, promise: asyncOperation): AnyPromise;
		wait(max: number, label: string | symbol, promise: asyncOperation): AnyPromise;
		race(promise: asyncOperation): AnyPromise;
		race(max: number, promise: asyncOperation): AnyPromise;
		race(max: number, label: string | symbol, promise: asyncOperation): AnyPromise;
		sleep(time: number, test?: (ctx: Context) => any, interval?: boolean): Promise<void>;
	}

	interface Callback<D, K, V> {
		(item: V, index: K, collection: D, context: Context): any;
	}

	interface EventCallback {
		(context: Context): any;
	}

	type Filter<D, K, V> = Callback<D, K, V>[] | Callback<D, K, V>;

	interface SingleBaseParams<D, K, V> {
		filter?: Filter<D, K, V>;
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
		parallel?: boolean | number;
		race?: boolean | number;
		thread?: boolean;
		priority?: string;
		onChunk?: EventCallback;
		onIterationEnd?: EventCallback;
	}

	interface Report<K, V> {
		result: Boolean;
		key: K;
		value: V;
		notFound?: boolean;
	}

	interface SetReport<N, K, V> extends Report<K, V> {
		newValue: N;
	}

	type SearchReport<K> = K | {value: K};

	interface BaseParams<D, K, V> extends SingleBaseParams<D, K, V> {
		mult?: boolean;
	}

	interface ForEachParams<D, K, V> extends BaseParams<D, K, V> {
		result?: any;
	}

	interface MapParams<D, K, V> extends BaseParams<D, K, V> {
		initial?: any;
	}

	interface MapParamsWithInitial<I, D, K, V> extends BaseParams<D, K, V> {
		initial: I;
	}

	interface SetParams<D, K, V> extends BaseParams<D, K, V> {
		create?: boolean;
	}

	interface GroupParamsMap<D, K, V> extends SingleBaseParams<D, K, V> {
		useMap: true;
	}

	interface GroupParamsRecord<D, K, V> extends SingleBaseParams<D, K, V> {
		useMap?: false;
	}

	interface ExtendParams<D, K, V> extends SingleBaseParams<D, K, V> {
		deep?: boolean;
		traits?: boolean;
		withDescriptor?: boolean;
		withAccessors?: boolean;
		withProto?: boolean;
		concatArray?: boolean;
		concatFn?(a: V, b: any[], key: K): any[];
		extendFilter?(a: V, b: any, key: K): any;
	}

	interface ReduceCallback<R, D, K, V> {
		(
			result: R,
			item: V,
			key: K,
			collection: D,
			context: Context
		): any;
	}

	interface SingleAsyncCollection<D, K, V> {
		readonly array: SingleAsyncCollection<V[], number, V>;
		readonly live: SingleAsyncCollection<D, K, V>;
		readonly descriptor: SingleAsyncCollection<D, K, PropertyDescriptor>;
		readonly inverse: SingleAsyncCollection<D, K, V>;
		readonly reverse: SingleAsyncCollection<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollection<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleAsyncCollection<D, K, V>;
		start(value: number): SingleAsyncCollection<D, K, V>;
		end(value: number): SingleAsyncCollection<D, K, V>;
		from(value: number): SingleAsyncCollection<D, K, V>;
		object(notOwn?: boolean | -1): SingleAsyncCollection<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollection<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollection<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollection<D, K, V>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<SingleAsyncCollection<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map(
			cb?: Callback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<D>;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		get(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<V | undefined>;

		get(
			link?: Link,
			params?: BaseParams<D, K, V>
		): V | undefined;

		set<N>(
			value: N,
			filterOrParams?: Filter<D, K, V> | SetParams<D, K, V>,
			params?: SetParams<D, K, V>
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			link?: Link,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>;

		remove(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<Report<K, V>>;

		remove(
			link?: Link,
			params?: BaseParams<D, K, V>
		): Report<K, V>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<SearchReport<K | V> | null>;

		includes(
			searchElement: V,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollection<D, K, V> {
		readonly array: AsyncCollection<V[], number, V>;
		readonly live: AsyncCollection<D, K, V>;
		readonly one: SingleAsyncCollection<D, K, V>;
		readonly descriptor: AsyncCollection<D, K, PropertyDescriptor>;
		readonly inverse: AsyncCollection<D, K, V>;
		readonly reverse: AsyncCollection<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollection<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): AsyncCollection<D, K, V>;
		start(value: number): AsyncCollection<D, K, V>;
		end(value: number): AsyncCollection<D, K, V>;
		count(value: number): AsyncCollection<D, K, V>;
		from(value: number): AsyncCollection<D, K, V>;
		object(notOwn?: boolean | -1): AsyncCollection<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollection<D, K, V>;
		parallel(max?: boolean | number): AsyncCollection<D, K, V>;
		race(max?: boolean | number): AsyncCollection<D, K, V>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<AsyncCollection<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map(
			cb?: Callback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<D>;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		get(
			params: BaseParams<D, K, V> & Single
		): ThreadObj<V | undefined>;

		get(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<V | undefined>;

		get(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<V[]>;

		get(
			link?: Link,
			params?: BaseParams<D, K, V>
		): V | undefined;

		set<N>(
			value: N,
			params: SetParams<D, K, V> & Single
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filter: Filter<D, K, V>,
			params: SetParams<D, K, V> & Single
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filterOrParams?: Filter<D, K, V> | SetParams<D, K, V>,
			params?: SetParams<D, K, V>
		): ThreadObj<SetReport<N, K, V>[]>;

		set<N>(
			value: N,
			link?: Link,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>;

		remove(
			params: BaseParams<D, K, V> & Single
		): ThreadObj<Report<K, V>>;

		remove(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<Report<K, V>>;

		remove(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<Report<K, V>[]>;

		remove(
			link?: Link,
			params?: BaseParams<D, K, V>
		): Report<K, V>;

		search(
			params: BaseParams<D, K, V> & Single
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<SearchReport<K | V>[]>;

		includes(
			searchElement: V,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<boolean>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollection<D, K, V> {
		readonly array: SingleCollection<V[], number, V>;
		readonly live: SingleCollection<D, K, V>;
		readonly descriptor: SingleCollection<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollection<D, K, V>;
		readonly reverse: SingleCollection<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleCollection<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollection<D, K, V>;
		start(value: number): SingleCollection<D, K, V>;
		end(value: number): SingleCollection<D, K, V>;
		from(value: number): SingleCollection<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollection<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleCollection<D, K, V>;
		parallel(max?: boolean | number): SingleCollection<D, K, V>;
		race(max?: boolean | number): SingleCollection<D, K, V>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V> & Async
		): ThreadObj<Collection<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V>
		): Collection<D, K, V>;

		length(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<number>;

		length(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<number>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): number;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map(
			params: MapParams<D, K, V> & Async
		): ThreadObj<D>;

		map(
			cb: Callback<D, K, V>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<D>;

		map(
			cb?: Callback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): D;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I>(
			callback: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		get(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<V | undefined>;

		get(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<V>;

		get(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): V | undefined;

		get(
			link?: Link,
			params?: BaseParams<D, K, V>
		): any;

		set<N>(
			value: N,
			params: SetParams<D, K, V> & Async
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filter: Filter<D, K, V>,
			params: SetParams<D, K, V> & Async
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filterOrParams?: Filter<D, K, V> | SetParams<D, K, V>,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>;

		set<N>(
			value: N,
			link?: Link,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>;

		remove(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<Report<K, V>>;

		remove(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<Report<K, V>>;

		remove(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): Report<K, V>;

		remove(
			link?: Link,
			params?: BaseParams<D, K, V>
		): Report<K, V>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): SearchReport<K | V> | null;

		includes(
			searchElement: V,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: V,
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: V,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		every(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		every(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		some(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		some(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): AnyMap;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): AnyMap;

		group(
			field: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): AnyRecord;

		extend(
			params: ExtendParams<D, K, V> & Async,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): D & AnyRecord;

		link(link: Link): boolean;
	}

	interface Collection<D, K, V> {
		readonly array: Collection<V[], number, V>;
		readonly live: Collection<D, K, V>;
		readonly one: SingleCollection<D, K, V>;
		readonly descriptor: Collection<D, K, PropertyDescriptor>;
		readonly inverse: Collection<D, K, V>;
		readonly reverse: Collection<D, K, V>;
		readonly async: AsyncCollection<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollection<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): Collection<D, K, V>;
		start(value: number): Collection<D, K, V>;
		end(value: number): Collection<D, K, V>;
		count(value: number): Collection<D, K, V>;
		from(value: number): Collection<D, K, V>;
		object(notOwn?: boolean | -1): Collection<Record<string, V>, string, V>;
		iterator(async?: boolean): Collection<D, K, V>;
		parallel(max?: boolean | number): Collection<D, K, V>;
		race(max?: boolean | number): Collection<D, K, V>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V> & Async
		): ThreadObj<Collection<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params?: ForEachParams<D, K, V>
		): Collection<D, K, V>;

		length(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<number>;

		length(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<number>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): number;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map(
			params: MapParams<D, K, V> & Async
		): ThreadObj<D>;

		map(
			cb: Callback<D, K, V>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<D>;

		map(
			cb?: Callback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): D;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I>(
			callback: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		get(
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<V | undefined>;

		get(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<V | undefined>;

		get(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<V[]>;

		get(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<V[]>;

		get(
			params: BaseParams<D, K, V> & Single
		): V | undefined;

		get(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): V | undefined;

		get(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): V[];

		get(
			link?: Link,
			params?: BaseParams<D, K, V>
		): V | undefined;

		set<N>(
			value: N,
			params: SetParams<D, K, V> & SingleAsync
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filter: Filter<D, K, V>,
			params: SetParams<D, K, V> & SingleAsync
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			params: SetParams<D, K, V> & Async
		): ThreadObj<SetReport<N, K, V>>;

		set<N>(
			value: N,
			filter: Filter<D, K, V>,
			params: SetParams<D, K, V> & Async
		): ThreadObj<SetReport<N, K, V>[]>;

		set<N>(
			value: N,
			params: SetParams<D, K, V> & Single
		): SetReport<N, K, V>;

		set<N>(
			value: N,
			filter: Filter<D, K, V>,
			params: SetParams<D, K, V> & Single
		): SetReport<N, K, V>;

		set<N>(
			value: N,
			filterOrParams?: Filter<D, K, V> | SetParams<D, K, V>,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>[];

		set<N>(
			value: N,
			link?: Link,
			params?: SetParams<D, K, V>
		): SetReport<N, K, V>;

		remove(
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<Report<K, V>>;

		remove(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<Report<K, V>>;

		remove(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<Report<K, V>[]>;

		remove(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<Report<K, V>[]>;

		remove(
			params: BaseParams<D, K, V> & Single
		): Report<K, V>;

		remove(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): Report<K, V>;

		remove(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): Report<K, V>[];

		remove(
			link?: Link,
			params?: BaseParams<D, K, V>
		): Report<K, V>;

		search(
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<SearchReport<K | V> | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<K | V>[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<K | V>[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): SearchReport<K | V> | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): SearchReport<K | V> | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): SearchReport<K | V>[];

		includes(
			searchElement: V,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: V,
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		includes(
			searchElement: V,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		every(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		every(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		every(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		some(
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		some(
			filter: Filter<D, K, V>,
			params: SingleBaseParams<D, K, V> & Async
		): ThreadObj<boolean>;

		some(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): boolean;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecord<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): AnyMap;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsMap<D, K, V>
		): AnyMap;

		group(
			field: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): AnyRecord;

		extend(
			params: ExtendParams<D, K, V> & Async,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): D & AnyRecord;

		link(link: Link): boolean;
	}
}

declare const $C: {
	(collection: string): CollectionJS.Collection<string[], number, string>;
	<V>(collection: V[]): CollectionJS.Collection<V[], number, V>;
	<V>(collection: Record<string, V>): CollectionJS.Collection<Record<string, V>, string, V>;
	<K, V>(collection: Map<K, V>): CollectionJS.Collection<Map<K, V>, K, V>;
	<V>(collection: Set<V>): CollectionJS.Collection<Set<V>, null, V>;
	<V>(collection: NodeJS.ReadableStream): CollectionJS.Collection<NodeJS.ReadableStream, number, V>;
	<V>(collection: IDBCursor): CollectionJS.Collection<IDBCursor, number, V>;
	<V>(collection: GeneratorFunction): CollectionJS.Collection<GeneratorFunction, number, V>;
	<V>(collection: Iterator<V>): CollectionJS.Collection<Iterator<V>, number, V>;

	extend<D, K, V>(
		params: CollectionJS.ExtendParams<D, K, V> & CollectionJS.Async,
		target?: D,
		...source: any[]
	): CollectionJS.ThreadObj<D & CollectionJS.AnyRecord>;

	extend<D, K, V>(
		deepOrParams: boolean | CollectionJS.ExtendParams<D, K, V>,
		target?: D,
		...source: any[]
	): D & CollectionJS.AnyRecord;

	clone(source: any): any;
	in(link: CollectionJS.Link, target: any): boolean;
};

declare module 'collection.js' {
	export = $C;
}

declare module 'collection.js/compiled' {
	export = $C;
}
