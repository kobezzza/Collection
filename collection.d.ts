/*!
 * Collection
 * https://github.com/kobezzza/Collection
 *
 * Released under the MIT license
 * https://github.com/kobezzza/Collection/blob/master/LICENSE
 */

declare namespace CollectionJS {
	type Link = any | any[];
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
		$: Object;
		info: Info;
		result: any;
		childResult: any[];
		onError: (err: Error) => void;
		i(value?: number): number | false;
		jump(value: number): number | false;
		yield(value: any): boolean;
		next(value: any): boolean;
		child(thread: Promise<any>): boolean;
	}

	interface AsyncContext extends Context {
		thread: Thread;
		length(reset?: boolean): Promise<number>;
		wait(promise: asyncOperation): Promise<any>;
		wait(max: number, promise: asyncOperation): Promise<any>;
		race(promise: asyncOperation): Promise<any>;
		race(max: number, promise: asyncOperation): Promise<any>;
		sleep(time: number, test?: (ctx: AsyncContext) => any, interval?: boolean): Promise<void>;
	}

	interface SyncContext extends Context {
		length(reset?: boolean): number;
		wait(promise: asyncOperation): false;
		wait(max: number, promise: asyncOperation): false;
		race(promise: asyncOperation): false;
		race(max: number, promise: asyncOperation): false;
		sleep(time: number, test?: (ctx: SyncContext) => any, interval?: boolean): false;
	}

	interface Callback<T> {
		(item: any, index: any, collection: T, context: SyncContext): any;
	}

	interface AsyncCallback<T> {
		(item: any, index: any, collection: T, context: AsyncContext): any;
	}

	interface EventCallback {
		(context: SyncContext): any;
	}

	interface AsyncEventCallback {
		(context: AsyncContext): any;
	}

	type Filter<T> = Array<Callback<T>> | Callback<T>;
	type AsyncFilter<T> = Array<AsyncCallback<T>> | AsyncCallback<T>;

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
		onChunk?: AsyncEventCallback;
	}

	interface AsyncSingleBaseParams<T> extends SingleCollection<T> {
		onIterationEnd?: AsyncEventCallback;
	}

	interface SyncSingleBaseParams<T> extends SingleCollection<T> {
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

	interface BaseParams<T> extends SyncSingleBaseParams<T> {
		mult?: boolean;
	}

	interface AsyncBaseParams<T> extends AsyncSingleBaseParams<T> {
		mult?: boolean;
	}

	interface ForEachParams<T> extends BaseParams<T> {
		result?: any;
	}

	interface AsyncForEachParams<T> extends AsyncBaseParams<T> {
		result?: any;
	}

	interface MapParams<T> extends BaseParams<T> {
		initial?: any;
	}

	interface AsyncMapParams<T> extends AsyncBaseParams<T> {
		initial?: any;
	}

	interface SetParams<T> extends BaseParams<T> {
		create?: boolean;
	}

	interface AsyncSetParams<T> extends AsyncBaseParams<T> {
		create?: boolean;
	}

	interface GroupParams<T> extends SyncSingleBaseParams<T> {
		useMap?: boolean;
		saveKeys?: boolean;
	}

	interface AsyncGroupParams<T> extends AsyncSingleBaseParams<T> {
		useMap?: boolean;
		saveKeys?: boolean;
	}

	interface ExtendParams<T> extends SyncSingleBaseParams<T> {
		deep?: boolean,
		traits?: boolean,
		withDescriptor?: boolean,
		withAccessors?: boolean,
		withProto?: boolean,
		concatArray?: boolean,
		concatFn?: (...arrays: any[]) => any[]
	}

	interface AsyncExtendParams<T> extends AsyncSingleBaseParams<T> {
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
			context: SyncContext
		): boolean | any;
	}

	interface AsyncReduceCallback<T> {
		(
			result: any,
			item: any,
			index: any,
			collection: T,
			context: AsyncContext
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
			priority?: string | AsyncEventCallback,
			onChunk?: AsyncEventCallback
		): SingleAsyncCollection<T>;

		filter(...filters: Array<AsyncFilter<T>>): SingleAsyncCollection<T>;
		start(value: number): SingleAsyncCollection<T>;
		end(value: number): SingleAsyncCollection<T>;
		from(value: number): SingleAsyncCollection<T>;
		object(notOwn: boolean | -1): SingleAsyncCollection<T>;

		forEach(
			cb: AsyncCallback<T>,
			params?: AsyncForEachParams<T>
		): Promise<SingleAsyncCollection<T>> & ThreadObj;

		length(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<number> & ThreadObj;

		map(
			cb?: AsyncCallback<T> | AsyncMapParams<T>,
			filterOrParams?: AsyncFilter<T> | AsyncMapParams<T>
		): Promise<T> & ThreadObj;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<A> & ThreadObj;

		get(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<any> & ThreadObj;

		get(
			link?: Link,
			params?: AsyncBaseParams<T>
		): any;

		set(
			value: any,
			filterOrParams?: AsyncFilter<T> | AsyncSetParams<T>,
			params?: AsyncSetParams<T>
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			link?: Link,
			params?: SetParams<T>
		): SetReport;

		remove(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<Report> & ThreadObj;

		remove(
			link?: Link,
			params?: BaseParams<T>
		): Report;

		search(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<any> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		group(
			field: any,
			params: AsyncGroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T>
		): Promise<Object> & ThreadObj;

		extend(
			deepOrParams: boolean | AsyncExtendParams<T>,
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
			priority?: string | AsyncEventCallback,
			onChunk?: AsyncEventCallback
		): AsyncCollection<T>;

		filter(...filters: Array<AsyncFilter<T>>): AsyncCollection<T>;
		start(value: number): AsyncCollection<T>;
		end(value: number): AsyncCollection<T>;
		count(value: number): AsyncCollection<T>;
		from(value: number): AsyncCollection<T>;
		object(notOwn: boolean | -1): AsyncCollection<T>;

		forEach(
			cb: AsyncCallback<T>,
			params?: AsyncForEachParams<T>
		): Promise<AsyncCollection<T>> & ThreadObj;

		length(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<number> & ThreadObj;

		map(
			cb?: AsyncCallback<T> | AsyncMapParams<T>,
			filterOrParams?: AsyncFilter<T> | AsyncMapParams<T>
		): Promise<T> & ThreadObj;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<A> & ThreadObj;

		get(
			params: AsyncBaseParams<T> & Single
		): Promise<any> & ThreadObj;

		get(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Single
		): Promise<any> & ThreadObj;

		get(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<any[]> & ThreadObj;

		get(
			link?: Link,
			params?: AsyncBaseParams<T>
		): any;

		set(
			value: any,
			params: AsyncSetParams<T> & Single
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: AsyncFilter<T>,
			params: AsyncSetParams<T> & Single
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filterOrParams?: AsyncFilter<T> | AsyncSetParams<T>,
			params?: AsyncSetParams<T>
		): Promise<SetReport[]> & ThreadObj;

		set(
			value: any,
			link?: Link,
			params?: AsyncSetParams<T>
		): SetReport;

		remove(
			params: AsyncBaseParams<T> & Single
		): Promise<Report> & ThreadObj;

		remove(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Single
		): Promise<Report> & ThreadObj;

		remove(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<Report[]> & ThreadObj;

		remove(
			link?: Link,
			params?: AsyncBaseParams<T>
		): Report;

		search(
			params: AsyncBaseParams<T> & Single
		): Promise<any> & ThreadObj;

		search(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Single
		): Promise<any> & ThreadObj;

		search(
			filterOrParams?: AsyncFilter<T> | AsyncBaseParams<T>,
			params?: AsyncBaseParams<T>
		): Promise<any[]> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: AsyncFilter<T> | AsyncSingleBaseParams<T>,
			params?: AsyncSingleBaseParams<T>
		): Promise<boolean> & ThreadObj;

		group(
			field: any,
			params: AsyncGroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & Async
		): Promise<Object> & ThreadObj;

		extend(
			deepOrParams: boolean | AsyncExtendParams<T>,
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
			priority?: string | AsyncEventCallback,
			onChunk?: AsyncEventCallback
		): SingleCollection<T>;

		filter(...filters: Array<AsyncFilter<T>>): SingleCollection<T>;
		start(value: number): SingleCollection<T>;
		end(value: number): SingleCollection<T>;
		from(value: number): SingleCollection<T>;
		object(notOwn: boolean | -1): SingleCollection<T>;

		forEach(
			cb: AsyncCallback<T>,
			params?: AsyncForEachParams<T> & Async
		): Promise<Collection<T>> & ThreadObj;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map(
			params: AsyncMapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb: AsyncCallback<T>,
			params: AsyncMapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue: A,
			params: AsyncBaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue: A,
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: AsyncBaseParams<T> & Async
		): Promise<any> & ThreadObj;

		get(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
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
			params: AsyncSetParams<T> & Async
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: AsyncFilter<T>,
			params: AsyncSetParams<T> & Async
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
			params: AsyncBaseParams<T> & Async
		): Promise<Report> & ThreadObj;

		remove(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
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
			params: AsyncBaseParams<T> & Async
		): Promise<any> & ThreadObj;

		search(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
		): Promise<any> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any;

		includes(
			searchElement: any,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		every(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		some(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: AsyncGroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			params: AsyncGroupParams<T> & Async
		): Promise<Object> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & Async
		): Promise<Object> & ThreadObj;

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
			params?: GroupParams<T>
		): Object;

		extend(
			params: AsyncExtendParams<T> & Async,
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
			priority?: string | AsyncEventCallback,
			onChunk?: AsyncEventCallback
		): AsyncCollection<T>;

		filter(...filters: Array<AsyncFilter<T>>): Collection<T>;
		start(value: number): Collection<T>;
		end(value: number): Collection<T>;
		count(value: number): Collection<T>;
		from(value: number): Collection<T>;
		object(notOwn: boolean | -1): Collection<T>;

		forEach(
			cb: AsyncCallback<T>,
			params?: AsyncForEachParams<T> & Async
		): Promise<Collection<T>> & ThreadObj;

		forEach(
			cb: Callback<T>,
			params?: ForEachParams<T>
		): Collection<T>;

		length(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<number> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number;

		map(
			params: AsyncMapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb: AsyncCallback<T>,
			params: AsyncMapParams<T> & Async
		): Promise<T> & ThreadObj;

		map(
			cb?: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue: A,
			params: AsyncBaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			cb: AsyncReduceCallback<T>,
			initialValue: A,
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
		): Promise<A> & ThreadObj;

		reduce<A>(
			callback: ReduceCallback<T>,
			initialValue?: A,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): A;

		get(
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		get(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		get(
			params: AsyncBaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		get(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
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
			params: AsyncSetParams<T> & SingleAsync
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			filter: AsyncFilter<T>,
			params: AsyncSetParams<T> & SingleAsync
		): Promise<SetReport> & ThreadObj;

		set(
			value: any,
			params: AsyncSetParams<T> & Async
		): Promise<SetReport[]> & ThreadObj;

		set(
			value: any,
			filter: AsyncFilter<T>,
			params: AsyncSetParams<T> & Async
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
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<Report> & ThreadObj;

		remove(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<Report> & ThreadObj;

		remove(
			params: AsyncBaseParams<T> & Async
		): Promise<Report[]> & ThreadObj;

		remove(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
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
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		search(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & SingleAsync
		): Promise<any> & ThreadObj;

		search(
			params: AsyncBaseParams<T> & Async
		): Promise<any[]> & ThreadObj;

		search(
			filter: AsyncFilter<T>,
			params: AsyncBaseParams<T> & Async
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
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		every(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		some(
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filter: AsyncFilter<T>,
			params: AsyncSingleBaseParams<T> & Async
		): Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SyncSingleBaseParams<T>,
			params?: SyncSingleBaseParams<T>
		): boolean;

		group(
			field: any,
			params: AsyncGroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & Async & {useMap: true}
		): Promise<Map<any, any>> & ThreadObj;

		group(
			field: any,
			params: AsyncGroupParams<T> & Async
		): Promise<Object> & ThreadObj;

		group(
			field: any,
			filter: AsyncFilter<T>,
			params: AsyncGroupParams<T> & Async
		): Promise<Object> & ThreadObj;

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
			params?: GroupParams<T>
		): Object;

		extend(
			params: AsyncExtendParams<T> & Async,
			...source: any[]
		): Promise<T> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T;

		link(link: CollectionJS.Link): boolean;
	}
}

declare const $C: {
	<T>(collection: T): CollectionJS.Collection<T>;

	extend<T>(
		params: CollectionJS.AsyncExtendParams<T> & CollectionJS.Async,
		target?: T,
		...source: any[]
	): Promise<T> & CollectionJS.ThreadObj;

	extend<T>(
		deepOrParams: boolean | CollectionJS.ExtendParams<T>,
		target?: T,
		...source: any[]
	): T;

	clone(source: any): any;
	in(link: CollectionJS.Link, target: any): boolean;
};
