/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

/// <reference types="node"/>
/// <reference lib="es2015"/>

declare namespace CollectionJS {
	type Link = any | any[];
	type AnyMap = Map<any, any>;
	type AnyRecord = Record<any, any>;
	type AnyPromise = Promise<any>;
	type AsyncOperation = AnyPromise | (() => AnyPromise);
	type DuplexStream = NodeJS.ReadableStream & NodeJS.WritableStream;
	type ReadStream = NodeJS.ReadableStream | DuplexStream;
	type ArrayLike<T> = {[index: number]: T; length: number};
	type Dictionary<T> = {[key: string]: T};

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

	interface DestroyError {
		type: 'CollectionThreadDestroy';
		thread: Thread;
	}

	type Thread = Generator & {
		readonly thread: true;
		readonly children: ThreadObj[];
		readonly stream: ReadStream | undefined;
		readonly sleep: any;
		pause: boolean;
		priority: string;
		onComplete?: Function;
		onChunk?: Function;
		destroy<E extends Object = Error>(err?: E): E & DestroyError | false;
	};

	type ThreadObj<T = any> = Promise<T> & {thread: Thread};
	type Single = {mult: false};
	type Async = {async: true} | {thread: true} | {parallel: true | number} | {race: true | number};
	type SingleAsync = Async & Single;

	interface Context {
		readonly true: TRUE;
		readonly false: FALSE;
		readonly reset: FALSE;
		readonly break: FALSE;
		readonly value: any;
		readonly id: number;
		readonly cursor: ReadStream | IDBRequest | undefined;
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
		wait(promise: AsyncOperation): AnyPromise;
		wait(max: number, promise: AsyncOperation): AnyPromise;
		wait(max: number, label: string | symbol, promise: AsyncOperation): AnyPromise;
		race(promise: AsyncOperation): AnyPromise;
		race(max: number, promise: AsyncOperation): AnyPromise;
		race(max: number, label: string | symbol, promise: AsyncOperation): AnyPromise;
		sleep(time: number, test?: (ctx: Context) => any, interval?: boolean): Promise<void>;
	}

	interface Callback<D, K, V> {
		(el: V, key: K, collection: D, ctx: Context): any;
	}

	interface EventCallback {
		(ctx: Context): any;
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

	type SearchReport<V> = {value: V};

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

	interface GroupParamsSmart<D, K, V> extends SingleBaseParams<D, K, V> {
		useMap?: true | void;
	}

	interface GroupParamsRecordStrict<D, K, V> extends SingleBaseParams<D, K, V> {
		useMap: false;
	}

	interface GroupParamsRecord<D, K, V> extends SingleBaseParams<D, K, V> {
		useMap?: false;
	}

	interface ExtendParams<D, K, V> extends SingleBaseParams<D, K, V> {
		deep?: boolean;
		traits?: boolean;
		withUndef?: boolean;
		withDescriptor?: boolean;
		withAccessors?: boolean;
		withProto?: boolean;
		concatArray?: boolean;
		concatFn?(a: V, b: any[], key: K): any[];
		extendFilter?(a: V, b: any, key: K): any;
	}

	interface MapCallback<D, K, V, R = any> {
		(el: V, key: K, collection: D, ctx: Context): R;
	}

	interface ReduceCallback<A, D, K, V, R = any> {
		(
			acc: A,
			el: V,
			key: K,
			collection: D,
			ctx: Context
		): R;
	}

	interface To<I, D, K, V> {
		map(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map(
			cb: MapCallback<D, K, V>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): I;

		reduce<R = I>(
			cb: ReduceCallback<R, D, K, V, R>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<R = I>(
			cb: ReduceCallback<R, D, K, V, R>,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<R = I>(
			callback: ReduceCallback<R, D, K, V, R>,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): I;
	}

	interface ToAsync<I, D, K, V> {
		map(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<I>;

		reduce<R = I>(
			cb: ReduceCallback<R, D, K, V, R>,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<I>;
	}

	interface ToStream<D, K, V> {
		map(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): DuplexStream;

		reduce(
			cb: ReduceCallback<DuplexStream, D, K, V>,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;
	}

	interface SingleAsyncCollection<D, K, V> {
		readonly array: SingleAsyncCollectionIterator<V[], number, V>;
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
		object(notOwn?: boolean | -1): SingleAsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollection<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollection<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollection<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollection<D, K, V> {
		readonly array: AsyncCollectionIterator<V[], number, V>;
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
		object(notOwn?: boolean | -1): AsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollection<D, K, V>;
		parallel(max?: boolean | number): AsyncCollection<D, K, V>;
		race(max?: boolean | number): AsyncCollection<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollection<D, K, V> {
		readonly array: SingleCollectionIterator<V[], number, V>;
		readonly live: SingleCollection<D, K, V>;
		readonly descriptor: SingleCollection<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollection<D, K, V>;
		readonly reverse: SingleCollection<D, K, V>;
		readonly async: SingleAsyncCollection<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollection<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollection<D, K, V>;
		start(value: number): SingleCollection<D, K, V>;
		end(value: number): SingleCollection<D, K, V>;
		from(value: number): SingleCollection<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): SingleAsyncCollection<D, K, V>;
		iterator(async?: boolean): SingleCollection<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollection<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollection<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollection<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollection<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleCollection<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<I = D>(
			cb: MapCallback<D, K, V>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<I = D>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): I;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K | null;

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
			field?: Link | Callback<D, K, V>,
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
		readonly array: CollectionIterator<V[], number, V>;
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
		object(notOwn?: boolean | -1): CollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): AsyncCollection<D, K, V>;
		iterator(async?: boolean): Collection<D, K, V>;
		parallel(max?: boolean | number): AsyncCollection<D, K, V>;
		race(max?: boolean | number): AsyncCollection<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<Collection<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<Collection<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<I = D>(
			cb: MapCallback<D, K, V>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<I = D>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): I;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<K | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K[];

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
			field?: Link | Callback<D, K, V>,
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

	interface SingleAsyncCollectionIterator<D, K, V> {
		readonly array: SingleAsyncCollectionIterator<V[], number, V>;
		readonly live: SingleAsyncCollectionIterator<D, K, V>;
		readonly descriptor: SingleAsyncCollectionIterator<D, K, PropertyDescriptor>;
		readonly inverse: SingleAsyncCollectionIterator<D, K, V>;
		readonly reverse: SingleAsyncCollectionIterator<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionIterator<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleAsyncCollectionIterator<D, K, V>;
		start(value: number): SingleAsyncCollectionIterator<D, K, V>;
		end(value: number): SingleAsyncCollectionIterator<D, K, V>;
		from(value: number): SingleAsyncCollectionIterator<D, K, V>;
		object(notOwn?: boolean | -1): SingleAsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollectionIterator<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionIterator<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionIterator<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<SingleAsyncCollectionIterator<D, K, V>>

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<R[]>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollectionIterator<D, K, V> {
		readonly array: AsyncCollectionIterator<V[], number, V>;
		readonly live: AsyncCollectionIterator<D, K, V>;
		readonly one: SingleAsyncCollectionIterator<D, K, V>;
		readonly descriptor: AsyncCollectionIterator<D, K, PropertyDescriptor>;
		readonly inverse: AsyncCollectionIterator<D, K, V>;
		readonly reverse: AsyncCollectionIterator<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionIterator<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): AsyncCollectionIterator<D, K, V>;
		start(value: number): AsyncCollectionIterator<D, K, V>;
		end(value: number): AsyncCollectionIterator<D, K, V>;
		count(value: number): AsyncCollectionIterator<D, K, V>;
		from(value: number): AsyncCollectionIterator<D, K, V>;
		object(notOwn?: boolean | -1): AsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollectionIterator<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionIterator<D, K, V>;
		race(max?: boolean | number): AsyncCollectionIterator<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<AsyncCollectionIterator<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<R[]>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollectionIterator<D, K, V> {
		readonly array: SingleCollectionIterator<V[], number, V>;
		readonly live: SingleCollectionIterator<D, K, V>;
		readonly descriptor: SingleCollectionIterator<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollectionIterator<D, K, V>;
		readonly reverse: SingleCollectionIterator<D, K, V>;
		readonly async: SingleAsyncCollectionIterator<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionIterator<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollectionIterator<D, K, V>;
		start(value: number): SingleCollectionIterator<D, K, V>;
		end(value: number): SingleCollectionIterator<D, K, V>;
		from(value: number): SingleCollectionIterator<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): SingleAsyncCollectionIterator<D, K, V>;
		iterator(async?: boolean): SingleCollectionIterator<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionIterator<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionIterator<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionIterator<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionIterator<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleCollectionIterator<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = V>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I[]>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<R[]>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): R[];

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K | null;

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
			field?: Link | Callback<D, K, V>,
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

	interface CollectionIterator<D, K, V> {
		readonly array: CollectionIterator<V[], number, V>;
		readonly live: CollectionIterator<D, K, V>;
		readonly one: SingleCollectionIterator<D, K, V>;
		readonly descriptor: CollectionIterator<D, K, PropertyDescriptor>;
		readonly inverse: CollectionIterator<D, K, V>;
		readonly reverse: CollectionIterator<D, K, V>;
		readonly async: AsyncCollectionIterator<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionIterator<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): CollectionIterator<D, K, V>;
		start(value: number): CollectionIterator<D, K, V>;
		end(value: number): CollectionIterator<D, K, V>;
		count(value: number): CollectionIterator<D, K, V>;
		from(value: number): CollectionIterator<D, K, V>;
		object(notOwn?: boolean | -1): CollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): AsyncCollectionIterator<D, K, V>;
		iterator(async?: boolean): CollectionIterator<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionIterator<D, K, V>;
		race(max?: boolean | number): AsyncCollectionIterator<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionIterator<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionIterator<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): CollectionIterator<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = V>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I[]>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<R[]>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): R[];

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<K | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K[];

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
			field?: Link | Callback<D, K, V>,
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

	interface SingleAsyncCollectionRecord<D, K, V> {
		readonly array: SingleAsyncCollectionIterator<V[], number, V>;
		readonly descriptor: SingleAsyncCollectionRecord<D, K, PropertyDescriptor>;
		readonly inverse: SingleAsyncCollectionRecord<D, K, V>;
		readonly reverse: SingleAsyncCollectionRecord<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionRecord<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleAsyncCollectionRecord<D, K, V>;
		start(value: number): SingleAsyncCollectionRecord<D, K, V>;
		end(value: number): SingleAsyncCollectionRecord<D, K, V>;
		from(value: number): SingleAsyncCollectionRecord<D, K, V>;
		object(notOwn?: boolean | -1): SingleAsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollectionRecord<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionRecord<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionRecord<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<SingleAsyncCollectionRecord<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Record<string, R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollectionRecord<D, K, V> {
		readonly array: AsyncCollectionIterator<V[], number, V>;
		readonly one: SingleAsyncCollectionRecord<D, K, V>;
		readonly descriptor: AsyncCollectionRecord<D, K, PropertyDescriptor>;
		readonly inverse: AsyncCollectionRecord<D, K, V>;
		readonly reverse: AsyncCollectionRecord<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionRecord<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): AsyncCollectionRecord<D, K, V>;
		start(value: number): AsyncCollectionRecord<D, K, V>;
		end(value: number): AsyncCollectionRecord<D, K, V>;
		count(value: number): AsyncCollectionRecord<D, K, V>;
		from(value: number): AsyncCollectionRecord<D, K, V>;
		object(notOwn?: boolean | -1): AsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollectionRecord<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionRecord<D, K, V>;
		race(max?: boolean | number): AsyncCollectionRecord<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<AsyncCollectionRecord<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Record<string, R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollectionRecord<D, K, V> {
		readonly array: SingleCollectionIterator<V[], number, V>;
		readonly descriptor: SingleCollectionRecord<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollectionRecord<D, K, V>;
		readonly reverse: SingleCollectionRecord<D, K, V>;
		readonly async: SingleAsyncCollectionMap<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionMap<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollectionRecord<D, K, V>;
		start(value: number): SingleCollectionRecord<D, K, V>;
		end(value: number): SingleCollectionRecord<D, K, V>;
		from(value: number): SingleCollectionRecord<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): SingleAsyncCollectionMap<D, K, V>;
		iterator(async?: boolean): SingleCollectionRecord<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionRecord<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionRecord<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleCollectionRecord<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Record<string, R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Record<string, R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K | null;

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
			field?: Link | Callback<D, K, V>,
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

	interface CollectionRecord<D, K, V> {
		readonly array: CollectionIterator<V[], number, V>;
		readonly one: SingleCollectionRecord<D, K, V>;
		readonly descriptor: CollectionRecord<D, K, PropertyDescriptor>;
		readonly inverse: CollectionRecord<D, K, V>;
		readonly reverse: CollectionRecord<D, K, V>;
		readonly async: AsyncCollectionRecord<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionRecord<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): CollectionRecord<D, K, V>;
		start(value: number): CollectionRecord<D, K, V>;
		end(value: number): CollectionRecord<D, K, V>;
		count(value: number): CollectionRecord<D, K, V>;
		from(value: number): CollectionRecord<D, K, V>;
		object(notOwn?: boolean | -1): CollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): AsyncCollectionRecord<D, K, V>;
		iterator(async?: boolean): CollectionRecord<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionRecord<D, K, V>;
		race(max?: boolean | number): AsyncCollectionRecord<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionRecord<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionRecord<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): CollectionRecord<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Record<string, R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Record<string, R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<K | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): K | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K[];

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
			field?: Link | Callback<D, K, V>,
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

	interface SingleAsyncCollectionMap<D, K, V> {
		readonly array: SingleAsyncCollectionIterator<V[], number, V>;
		readonly live: SingleAsyncCollectionMap<D, K, V>;
		readonly descriptor: SingleAsyncCollectionMap<D, K, PropertyDescriptor>;
		readonly inverse: SingleAsyncCollectionMap<D, K, V>;
		readonly reverse: SingleAsyncCollectionMap<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionMap<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleAsyncCollectionMap<D, K, V>;
		start(value: number): SingleAsyncCollectionMap<D, K, V>;
		end(value: number): SingleAsyncCollectionMap<D, K, V>;
		from(value: number): SingleAsyncCollectionMap<D, K, V>;
		object(notOwn?: boolean | -1): SingleAsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollectionMap<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<SingleAsyncCollectionMap<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Map<K, R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<K> | null>;

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
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): ThreadObj<AnyMap>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollectionMap<D, K, V> {
		readonly array: AsyncCollectionIterator<V[], number, V>;
		readonly live: AsyncCollectionMap<D, K, V>;
		readonly one: SingleAsyncCollectionMap<D, K, V>;
		readonly descriptor: AsyncCollectionMap<D, K, PropertyDescriptor>;
		readonly inverse: AsyncCollectionMap<D, K, V>;
		readonly reverse: AsyncCollectionMap<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionMap<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): AsyncCollectionMap<D, K, V>;
		start(value: number): AsyncCollectionMap<D, K, V>;
		end(value: number): AsyncCollectionMap<D, K, V>;
		count(value: number): AsyncCollectionMap<D, K, V>;
		from(value: number): AsyncCollectionMap<D, K, V>;
		object(notOwn?: boolean | -1): AsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollectionMap<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionMap<D, K, V>;
		race(max?: boolean | number): AsyncCollectionMap<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<AsyncCollectionMap<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Map<K, R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<K> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<SearchReport<K> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): ThreadObj<AnyMap>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollectionMap<D, K, V> {
		readonly array: SingleCollectionIterator<V[], number, V>;
		readonly live: SingleCollectionMap<D, K, V>;
		readonly descriptor: SingleCollectionMap<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollectionMap<D, K, V>;
		readonly reverse: SingleCollectionMap<D, K, V>;
		readonly async: SingleAsyncCollectionMap<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionMap<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollectionMap<D, K, V>;
		start(value: number): SingleCollectionMap<D, K, V>;
		end(value: number): SingleCollectionMap<D, K, V>;
		from(value: number): SingleCollectionMap<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): SingleAsyncCollectionMap<D, K, V>;
		iterator(async?: boolean): SingleCollectionMap<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionMap<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionMap<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionMap<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleCollectionMap<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Map<K, R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Map<K, R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<K> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<K> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): SearchReport<K> | null;

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
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): AnyMap;

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

	interface CollectionMap<D, K, V> {
		readonly array: CollectionIterator<V[], number, V>;
		readonly live: CollectionMap<D, K, V>;
		readonly one: SingleCollectionMap<D, K, V>;
		readonly descriptor: CollectionMap<D, K, PropertyDescriptor>;
		readonly inverse: CollectionMap<D, K, V>;
		readonly reverse: CollectionMap<D, K, V>;
		readonly async: AsyncCollectionMap<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionMap<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): CollectionMap<D, K, V>;
		start(value: number): CollectionMap<D, K, V>;
		end(value: number): CollectionMap<D, K, V>;
		count(value: number): CollectionMap<D, K, V>;
		from(value: number): CollectionMap<D, K, V>;
		object(notOwn?: boolean | -1): CollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): AsyncCollectionMap<D, K, V>;
		iterator(async?: boolean): CollectionMap<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionMap<D, K, V>;
		race(max?: boolean | number): AsyncCollectionMap<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionMap<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionMap<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): CollectionMap<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Map<K, R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Map<K, R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<K | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): SearchReport<K> | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): SearchReport<K> | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K[];

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
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): AnyMap;

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

	interface SingleAsyncCollectionSet<D, K, V> {
		readonly array: SingleAsyncCollectionIterator<V[], number, V>;
		readonly live: SingleAsyncCollectionSet<D, K, V>;
		readonly descriptor: SingleAsyncCollectionSet<D, K, PropertyDescriptor>;
		readonly inverse: SingleAsyncCollectionSet<D, K, V>;
		readonly reverse: SingleAsyncCollectionSet<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionSet<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleAsyncCollectionSet<D, K, V>;
		start(value: number): SingleAsyncCollectionSet<D, K, V>;
		end(value: number): SingleAsyncCollectionSet<D, K, V>;
		from(value: number): SingleAsyncCollectionSet<D, K, V>;
		object(notOwn?: boolean | -1): SingleAsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): SingleAsyncCollectionSet<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionSet<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionSet<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleAsyncCollectionSet<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleAsyncCollectionSet<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleAsyncCollectionSet<D, K, V>;

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

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: Callback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Set<R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<V> | null>;

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
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): ThreadObj<AnyMap>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface AsyncCollectionSet<D, K, V> {
		readonly array: AsyncCollectionIterator<V[], number, V>;
		readonly live: AsyncCollectionSet<D, K, V>;
		readonly one: SingleAsyncCollectionSet<D, K, V>;
		readonly descriptor: AsyncCollectionSet<D, K, PropertyDescriptor>;
		readonly inverse: AsyncCollectionSet<D, K, V>;
		readonly reverse: AsyncCollectionSet<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionSet<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): AsyncCollectionSet<D, K, V>;
		start(value: number): AsyncCollectionSet<D, K, V>;
		end(value: number): AsyncCollectionSet<D, K, V>;
		count(value: number): AsyncCollectionSet<D, K, V>;
		from(value: number): AsyncCollectionSet<D, K, V>;
		object(notOwn?: boolean | -1): AsyncCollectionRecord<Record<string, V>, string, V>;
		iterator(async?: boolean): AsyncCollectionSet<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionSet<D, K, V>;
		race(max?: boolean | number): AsyncCollectionSet<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<AsyncCollectionSet<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): ThreadObj<Set<R>>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<V> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<SearchReport<V> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): ThreadObj<AnyRecord>;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): ThreadObj<AnyMap>;

		extend(
			deepOrParams: boolean | ExtendParams<D, K, V>,
			...source: any[]
		): ThreadObj<D & AnyRecord>;

		link(link: Link): boolean;
	}

	interface SingleCollectionSet<D, K, V> {
		readonly array: SingleCollectionIterator<V[], number, V>;
		readonly live: SingleCollectionSet<D, K, V>;
		readonly descriptor: SingleCollectionSet<D, K, PropertyDescriptor>;
		readonly inverse: SingleCollectionSet<D, K, V>;
		readonly reverse: SingleCollectionSet<D, K, V>;
		readonly async: SingleAsyncCollectionSet<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): SingleAsyncCollectionSet<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollectionSet<D, K, V>;
		start(value: number): SingleCollectionSet<D, K, V>;
		end(value: number): SingleCollectionSet<D, K, V>;
		from(value: number): SingleCollectionSet<D, K, V>;
		object(notOwn?: boolean | -1): SingleCollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): SingleAsyncCollectionSet<D, K, V>;
		iterator(async?: boolean): SingleCollectionSet<D, K, V>;
		parallel(max?: boolean | number): SingleAsyncCollectionSet<D, K, V>;
		race(max?: boolean | number): SingleAsyncCollectionSet<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionSet<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<SingleCollectionSet<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): SingleCollectionSet<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Set<R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Set<R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<SearchReport<V> | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<SearchReport<V> | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): SearchReport<V> | null;

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
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): AnyMap;

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

	interface CollectionSet<D, K, V> {
		readonly array: CollectionIterator<V[], number, V>;
		readonly live: CollectionSet<D, K, V>;
		readonly one: SingleCollectionSet<D, K, V>;
		readonly descriptor: CollectionSet<D, K, PropertyDescriptor>;
		readonly inverse: CollectionSet<D, K, V>;
		readonly reverse: CollectionSet<D, K, V>;
		readonly async: AsyncCollectionSet<D, K, V>;

		thread(
			priority?: string | EventCallback,
			onChunk?: EventCallback
		): AsyncCollectionSet<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): CollectionSet<D, K, V>;
		start(value: number): CollectionSet<D, K, V>;
		end(value: number): CollectionSet<D, K, V>;
		count(value: number): CollectionSet<D, K, V>;
		from(value: number): CollectionSet<D, K, V>;
		object(notOwn?: boolean | -1): CollectionRecord<Record<string, V>, string, V>;
		iterator(async: true): AsyncCollectionSet<D, K, V>;
		iterator(async?: boolean): CollectionSet<D, K, V>;
		parallel(max?: boolean | number): AsyncCollectionSet<D, K, V>;
		race(max?: boolean | number): AsyncCollectionSet<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionSet<D, K, V>>;

		forEach(
			cb: Callback<D, K, V>,
			params: ForEachParams<D, K, V> & Async
		): ThreadObj<CollectionSet<D, K, V>>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): CollectionSet<D, K, V>;

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
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V> & Async
		): ThreadObj<I>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): I;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = D>(
			params: MapParams<D, K, V> & Async
		): ThreadObj<I>;

		map<R = V>(
			cb: MapCallback<D, K, V, R>,
			params: MapParams<D, K, V> & Async
		): ThreadObj<Set<R>>;

		map<R = V>(
			cb?: MapCallback<D, K, V, R> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): Set<R>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue: void,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<I>;

		reduce<I = V>(
			callback: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): I;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue: I,
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<R>;

		reduce<I, R = I>(
			callback: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): R;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & SingleAsync
		): ThreadObj<K | null>;

		search(
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Async
		): ThreadObj<K[]>;

		search(
			params: BaseParams<D, K, V> & Single
		): SearchReport<V> | null;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): SearchReport<V> | null;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): K[];

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
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsSmart<D, K, V> & Async
		): ThreadObj<AnyMap>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V> & Async
		): ThreadObj<AnyRecord>;

		group(
			field: Link | Callback<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field: Link | Callback<D, K, V>,
			filter: Filter<D, K, V>,
			params: GroupParamsRecordStrict<D, K, V>
		): AnyRecord;

		group(
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsSmart<D, K, V>,
			params?: GroupParamsSmart<D, K, V>
		): AnyMap;

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

	interface SingleCollectionStream<D, K, V> {
		readonly inverse: SingleCollectionStream<D, K, V>;
		readonly reverse: SingleCollectionStream<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): SingleCollectionStream<D, K, V>;
		start(value: number): SingleCollectionStream<D, K, V>;
		end(value: number): SingleCollectionStream<D, K, V>;
		from(value: number): SingleCollectionStream<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<SingleCollectionStream<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = DuplexStream>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): I;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

		get(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<V | undefined>;

		get(
			link?: Link,
			params?: BaseParams<D, K, V>
		): V | undefined;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K | null>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;
	}

	interface CollectionStream<D, K, V> {
		readonly one: SingleCollectionStream<D, K, V>;
		readonly inverse: CollectionStream<D, K, V>;
		readonly reverse: CollectionStream<D, K, V>;

		filter(...filters: Filter<D, K, V>[]): CollectionStream<D, K, V>;
		start(value: number): CollectionStream<D, K, V>;
		end(value: number): CollectionStream<D, K, V>;
		count(value: number): CollectionStream<D, K, V>;
		from(value: number): CollectionStream<D, K, V>;
		to<I>(value: I): To<I, D, K, V>;
		toStream(obj?: boolean): ToStream<D, K, V>;
		toStream(readObj?: boolean, writeObj?: boolean): ToStream<D, K, V>;

		forEach(
			cbOrParams?: Callback<D, K, V> | ForEachParams<D, K, V>,
			params?: ForEachParams<D, K, V>
		): ThreadObj<CollectionStream<D, K, V>>;

		length(
			filterOrParams?: Filter<D, K, V> | SingleBaseParams<D, K, V>,
			params?: SingleBaseParams<D, K, V>
		): ThreadObj<number>;

		map<I>(
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): ThreadObj<I>;

		map<I extends ReadStream>(
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I extends ReadStream>(
			cb: MapCallback<D, K, V>,
			params: MapParamsWithInitial<I, D, K, V>
		): DuplexStream;

		map<I = DuplexStream>(
			cb?: MapCallback<D, K, V> | MapParams<D, K, V>,
			filterOrParams?: Filter<D, K, V> | MapParams<D, K, V>
		): DuplexStream;

		reduce<I = V>(
			cb: ReduceCallback<V, D, K, V, I>,
			initialValue?: void,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<I>;

		reduce<I, R = I>(
			cb: ReduceCallback<I, D, K, V, R>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<R>;

		reduce<I extends ReadStream>(
			cb: ReduceCallback<I, D, K, V>,
			initialValue?: I,
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): DuplexStream;

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

		search(
			params: BaseParams<D, K, V> & Single
		): ThreadObj<K | null>;

		search(
			filter: Filter<D, K, V>,
			params: BaseParams<D, K, V> & Single
		): ThreadObj<K | null>;

		search(
			filterOrParams?: Filter<D, K, V> | BaseParams<D, K, V>,
			params?: BaseParams<D, K, V>
		): ThreadObj<K[]>;

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
			field?: Link | Callback<D, K, V>,
			filterOrParams?: Filter<D, K, V> | GroupParamsRecord<D, K, V>,
			params?: GroupParamsRecord<D, K, V>
		): ThreadObj<AnyRecord>;
	}
}

declare const $C: {
	(collection: string): CollectionJS.CollectionIterator<string[], number, string>;
	(collection: number): CollectionJS.CollectionIterator<Iterator<void>, number, void>;
	(collection: Int8Array): CollectionJS.CollectionIterator<Int8Array, number, number>;
	(collection: Uint8Array): CollectionJS.CollectionIterator<Uint8Array, number, number>;
	(collection: Uint8ClampedArray): CollectionJS.CollectionIterator<Uint8ClampedArray, number, number>;
	(collection: Int16Array): CollectionJS.CollectionIterator<Int16Array, number, number>;
	(collection: Uint16Array): CollectionJS.CollectionIterator<Uint16Array, number, number>;
	(collection: Int32Array): CollectionJS.CollectionIterator<Int32Array, number, number>;
	(collection: Uint32Array): CollectionJS.CollectionIterator<Uint32Array, number, number>;
	(collection: Float32Array): CollectionJS.CollectionIterator<Float32Array, number, number>;
	(collection: Float64Array): CollectionJS.CollectionIterator<Float64Array, number, number>;
	(collection: CSSRuleList): CollectionJS.CollectionIterator<CSSRuleList, number, CSSRule>;
	(collection: CSSStyleDeclaration): CollectionJS.CollectionIterator<CSSStyleDeclaration, number, string>;
	(collection: StyleSheetList): CollectionJS.CollectionIterator<StyleSheetList, number, StyleSheet>;
	(collection: TextTrackCueList): CollectionJS.CollectionIterator<TextTrackCueList, number, TextTrackCue>;
	(collection: TextTrackList): CollectionJS.CollectionIterator<TextTrackList, number, TextTrack>;
	(collection: TouchList): CollectionJS.CollectionIterator<TouchList, number, Touch>;
	(collection: DataTransferItemList): CollectionJS.CollectionIterator<DataTransferItemList, number, DataTransferItem>;
	(collection: DOMStringList): CollectionJS.CollectionIterator<DOMStringList, number, string>;
	(collection: DOMTokenList): CollectionJS.CollectionIterator<DOMTokenList, number, string>;
	(collection: FileList): CollectionJS.CollectionIterator<FileList, number, File>;
	(collection: MediaList): CollectionJS.CollectionIterator<MediaList, number, string>;
	(collection: MimeTypeArray): CollectionJS.CollectionIterator<MimeTypeArray, number, Plugin>;
	(collection: Plugin): CollectionJS.CollectionIterator<Plugin, number, MimeType>;
	(collection: PluginArray): CollectionJS.CollectionIterator<PluginArray, number, Plugin>;
	(collection: NamedNodeMap): CollectionJS.CollectionIterator<NamedNodeMap, number, Attr>;
	(collection: SourceBufferList): CollectionJS.CollectionIterator<SourceBufferList, number, SourceBuffer>;
	(collection: Storage): CollectionJS.CollectionIterator<Storage, string, string>;
	(collection: HTMLAllCollection): CollectionJS.CollectionIterator<HTMLAllCollection, number, Element>;
	<V extends Element = Element>(collection: HTMLCollectionOf<V>): CollectionJS.CollectionIterator<HTMLCollectionOf<V>, number, V>;
	<V = Element>(collection: HTMLCollectionBase): CollectionJS.CollectionIterator<HTMLCollectionBase, number, V>;
	<V extends Node = Node>(collection: NodeListOf<V>): CollectionJS.CollectionIterator<NodeListOf<V>, number, V>;
	<V = Node>(collection: NodeList): CollectionJS.CollectionIterator<NodeList, number, V>;
	<V = any>(collection: IArguments): CollectionJS.CollectionIterator<IArguments, number, V>;
	<V = any>(collection: V[]): CollectionJS.CollectionIterator<V[], number, V>;
	<V = any>(collection: CollectionJS.ArrayLike<V>): CollectionJS.CollectionIterator<CollectionJS.ArrayLike<V>, number, V>;
	<K = any, V = any>(collection: Map<K, V>): CollectionJS.CollectionMap<Map<K, V>, K, V>;
	<V = any>(collection: Set<V>): CollectionJS.CollectionSet<Set<V>, null, V>;
	<V = any>(collection: Iterator<V>): CollectionJS.CollectionIterator<Iterator<V>, number, V>;
	<V = any>(collection: Iterable<V>): CollectionJS.CollectionIterator<Iterable<V>, number, V>;
	<V = any>(collection: CollectionJS.ReadStream): CollectionJS.CollectionStream<CollectionJS.ReadStream, number, V>;
	<V = any>(collection: IDBCursor): CollectionJS.CollectionIterator<IDBCursor, number, V>;
	<V = any>(collection: GeneratorFunction): CollectionJS.CollectionIterator<GeneratorFunction, number, V>;
	<V = any>(collection: CollectionJS.Dictionary<V>): CollectionJS.CollectionRecord<CollectionJS.Dictionary<V>, string, V>;
	<V = any, K extends string = string>(collection: Record<K, V>): CollectionJS.CollectionRecord<Record<K, V>, K, V>;
	<K = any, V = any, D = any>(collection: D): CollectionJS.Collection<D, K, V>;

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
	destroy(thread: CollectionJS.ThreadObj): Error & CollectionJS.DestroyError;
};

declare module 'collection.js' {
	export = $C;
}

declare module 'collection.js/compiled' {
	export = $C;
}
