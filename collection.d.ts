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
		thread: Thread;
		onError: (err: Error) => void;
		length(reset?: boolean): number | Promise<number>;
		i(value?: number): number | false;
		jump(value: number): number | false;
		yield(value: any): boolean;
		next(value: any): boolean;
		child(thread: Promise<any>): boolean;
		wait<T>(promise: asyncOperation): Promise<T> | false;
		wait<T>(max: number, promise: asyncOperation): Promise<T> | false;
		race<T>(promise: asyncOperation): Promise<T> | false;
		race<T>(max: number, promise: asyncOperation): Promise<T> | false;
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

		map(
			callback: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): Promise<T> & ThreadObj;

		reduce(
			callback: ReduceCallback<T>,
			initialValue?: any,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Promise<any> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T> | Link,
			params?: SetParams<T>
		): Promise<SetReport> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Promise<Report> & ThreadObj;

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
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): Promise<Object | Map<any, any>> & ThreadObj;

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

		map(
			callback: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): Promise<T> & ThreadObj;

		reduce(
			callback: ReduceCallback<T>,
			initialValue?: any,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Promise<any | any[]> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T> | Link,
			params?: SetParams<T>
		): Promise<SetReport | SetReport[]> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Promise<Report | Report[]> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): Promise<any | any[]> & ThreadObj;

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
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): Promise<Object | Map<any, any>> & ThreadObj;

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
			params?: ForEachParams<T>
		): SingleCollection<T> | Promise<SingleCollection<T>> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number | Promise<number> & ThreadObj;

		map(
			callback: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T | Promise<T> & ThreadObj;

		reduce(
			callback: ReduceCallback<T>,
			initialValue?: any,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any | Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): any | Promise<any> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T> | Link,
			params?: SetParams<T>
		): SetReport | Promise<SetReport> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Report | Promise<Report> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any | Promise<any> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): Object | Map<any, any> | Promise<Object | Map<any, any>> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T | Promise<T> & ThreadObj;

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
			params?: ForEachParams<T>
		): Collection<T> | Promise<Collection<T>> & ThreadObj;

		length(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): number | Promise<number> & ThreadObj;

		map(
			callback: Callback<T> | MapParams<T>,
			filterOrParams?: Filter<T> | MapParams<T>
		): T | Promise<T> & ThreadObj;

		reduce(
			callback: ReduceCallback<T>,
			initialValue?: any,
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any | Promise<any> & ThreadObj;

		get(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): any | any[] | Promise<any | any[]> & ThreadObj;

		set(
			value: any,
			filterOrParams?: Filter<T> | SetParams<T> | Link,
			params?: SetParams<T>
		): SetReport | SetReport[] | Promise<SetReport | SetReport[]> & ThreadObj;

		remove(
			filterOrParams?: Filter<T> | BaseParams<T> | Link,
			params?: BaseParams<T>
		): Report | Report[] | Promise<Report | Report[]> & ThreadObj;

		search(
			filterOrParams?: Filter<T> | BaseParams<T>,
			params?: BaseParams<T>
		): any | any[] | Promise<any | any[]> & ThreadObj;

		includes(
			searchElement: any,
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		every(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		some(
			filterOrParams?: Filter<T> | SingleBaseParams<T>,
			params?: SingleBaseParams<T>
		): boolean | Promise<boolean> & ThreadObj;

		group(
			field: any,
			filterOrParams?: Filter<T> | GroupParams<T>,
			params?: SingleBaseParams<T>
		): Object | Map<any, any> | Promise<Object | Map<any, any>> & ThreadObj;

		extend(
			deepOrParams: boolean | ExtendParams<T>,
			...source: any[]
		): T | Promise<T> & ThreadObj;

		link(link: CollectionJS.Link): boolean;
	}
}

declare const $C: {
	<T>(collection: T): CollectionJS.Collection<T>;

	extend: <T>(
		deepOrParams: boolean | CollectionJS.ExtendParams<T>,
		target?: T,
		...source: any[]
	) => T | Promise<T> & CollectionJS.ThreadObj

	clone: (source: any) => any;
	in: <T>(link: CollectionJS.Link, target: T) => boolean;
};
