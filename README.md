# t-hooks

This is a tiny hooks for working with react.js application.

## API

## Default useRequest

By default, the first parameter of `useRequest` is an asynchronous function, which is automatically executed when the component is initialized. At the same time, it automatically manages the status of `loading`, `data`, `error` of the asynchronous function.

```js
const { data, error, loading } = useRequest(service);
```
```ts
const {
  loading: boolean,
  data?: TData,
  error?: Error,
  params: TParams || [],
  run: (...params: TParams) => void,
  runAsync: (...params: TParams) => Promise<TData>,
  refresh: () => void,
  refreshAsync: () => Promise<TData>,
  mutate: (data?: TData | ((oldData?: TData) => (TData | undefined))) => void,
  cancel: () => void,
} = useRequest<TData, TParams>(
  service: (...args: TParams) => Promise<TData>,
  {
    manual?: boolean,
    defaultParams?: TParams,
    onBefore?: (params: TParams) => void,
    onSuccess?: (data: TData, params: TParams) => void,
    onError?: (e: Error, params: TParams) => void,
    onFinally?: (params: TParams, data?: TData, e?: Error) => void,
  }
);
```


### Result

| Property     | Description                                                                                                                                                                             | Type                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| data         | Data returned by service                                                                                                                                                                | `TData` \| `undefined`                                                |
| error        | Exception thrown by service                                                                                                                                                             | `Error` \| `undefined`                                                |
| loading      | Is the service being executed                                                                                                                                                           | `boolean`                                                             |
| params       | An array of parameters for the service being executed. For example, you triggered `run(1, 2, 3)`, then params is equal to `[1, 2, 3]`                                                   | `TParams` \| `[]`                                                     |
| run          | <ul><li> Manually trigger the execution of the service, and the parameters will be passed to the service</li><li>Automatic handling of exceptions, feedback through `onError`</li></ul> | `(...params : TParams) => void`                                       |
| runAsync     | The usage is the same as `run`, but it returns a Promise, so you need to handle the exception yourself.                                                                                 | `(...params: TParams) => Promise<TData>`                              |
| refresh      | Use the last params, call `run` again                                                                                                                                                   | `() => void`                                                          |
| refreshAsync | Use the last params, call `runAsync` again                                                                                                                                              | `() => Promise<TData>`                                                |
| mutate       | Mutate `data` directly                                                                                                                                                                  | `(data?: TData / ((oldData?: TData) => (TData / undefined))) => void` |
| cancel       | Ignore the current promise response                                                                                                                                                     | `() => void`                                                          |

### Options

| Property      | Description                                                                                                                                                                                                      | Type                                                 | Default |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------- |
| manual        | <ul><li> The default is `false`. That is, the service is automatically executed during initialization. </li><li>If set to `true`, you need to manually call `run` or `runAsync` to trigger execution. </li></ul> | `boolean`                                            | `false` |
| defaultParams | The parameters passed to the service at the first default execution                                                                                                                                              | `TParams`                                            | -       |
| onBefore      | Triggered before service execution                                                                                                                                                                               | `(params: TParams) => void`                          | -       |
| onSuccess     | Triggered when service resolve                                                                                                                                                                                   | `(data: TData, params: TParams) => void`             | -       |
| onError       | Triggered when service reject                                                                                                                                                                                    | `(e: Error, params: TParams) => void`                | -       |
| onFinally     | Triggered when service execution is complete                                                                                                                                                                     | `(params: TParams, data?: TData, e?: Error) => void` | -       |

## useBreakpoints

this hook is returning screen size in boolean

```ts
import {useBreakpoint} from './useBreakpoint'

const { xs, sm, md, lg, xl, xxl } = useBreakpoint();
```

# useCreation

`useCreation` is the replacement for `useMemo` or `useRef`.

> **You may rely on useMemo as a performance optimization, not as a semantic guarantee.** In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

And similar to `useRef`, you can use `useCreation` to create some constants. But `useCreation` can avoid performance hazards.

```javascript
const a = useRef(new Subject()); // A new Subject instance is created in every render.
const b = useCreation(() => new Subject(), []); // By using factory function, Subject is only instantiated once.
```

# useLatest

A Hook that returns the latest value, effectively avoiding the closure problem.

## Examples

### Basic usage

<code src="./demo/demo1.tsx" />

## API

```typescript
const latestValueRef = useLatest<T>(value: T): MutableRefObject<T>;
```

# useMemoizedFn

Hooks for persistent functions. In general, useMemoizedFn can be used instead of useCallback. See [FAQ](#faq) for special cases.

In some scenarios, we need to use useCallback to cache a function, but when the second parameter deps changes, the function will be regenerated, causing the function reference to change.

```js
const [state, setState] = useState('');

// When the state changes, the func reference will change
const func = useCallback(() => {
  console.log(state);
}, [state]);
```

```typescript
const memoizedFn = useMemoizedFn<T>(fn: T): T;
```

### Result

| Property   | Description                                       | Type                      |
| ---------- | ------------------------------------------------- | ------------------------- |
| memoizedFn | Function that the reference address never changes | `(...args: any[]) => any` |

### Params

| Property | Description                       | Type                      | Default |
| -------- | --------------------------------- | ------------------------- | ------- |
| fn       | Function that require persistence | `(...args: any[]) => any` | -       |

# useMount

A hook that executes a function after the component is mounted.

## Examples

### Default Usage

<code src="./demo/demo1.tsx" />

## API

```typescript
useMount(fn: () => void);
```

### Params

| Property | Description                 | Type         | Default |
| -------- | --------------------------- | ------------ | ------- |
| fn       | The function to be executed | `() => void` | -       |

# useUnmount

A hook that executes the function right before the component is unmounted.

## Examples

### Default Usage

<code src="./demo/demo1.tsx" />

## API

```typescript
useUnmount(fn: () => void);
```

### Params

| Property | Description                 | Type         | Default |
| -------- | --------------------------- | ------------ | ------- |
| fn       | The function to be executed | `() => void` | -       |



# useUpdate

A hook that returns a function which can be used to force the component to re-render.

## Examples

### Default Usage

<code src="./demo/demo1.tsx" />

## API

```typescript
const update = useUpdate();
```


# useUpdateEffect

A hook alike `useEffect` but skips running the effect for the first time.

## Examples

### Basic usage

<code src="./demo/demo1.tsx" />

## API

The API is exactly the same as `React.useEffect`.

```typescript
useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
)
```