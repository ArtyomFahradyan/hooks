/* eslint-disable @typescript-eslint/no-parameter-properties */
import type { MutableRefObject } from "react";
import { CustomAny } from "types";
import { isFunction } from '../../../helpers'
import type {
  FetchState,
  Options,
  PluginReturn,
  Service,
  Subscribe,
} from "./types";

function devLog(...params: CustomAny): void {
  if (process.env.REACT_APP_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...params);
  }
}

export default class Fetch<TData, TParams extends CustomAny[]> {
  pluginImpls: PluginReturn<TData, TParams>[] | undefined;
  count = 0;

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {}
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    };
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }

  runPluginHandler(
    event: keyof PluginReturn<TData, TParams>,
    ...rest: CustomAny[]
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1;
    const currentCount = this.count;

    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler("onBefore", params);

    // stop request
    if (stopNow) {
      return new Promise(() => ({}));
    }

    this.setState({
      loading: true,
      params,
      ...state,
    });

    // return now
    if (returnNow) {
      return Promise.resolve(state.data);
    }

    this.options.onBefore?.(params);

    try {
      // replace service
      let { servicePromise } = this.runPluginHandler(
        "onRequest",
        this.serviceRef.current,
        params
      );

      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      const res = await servicePromise;

      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => ({}));
      }

      // const formattedResult = this.options.formatResultRef.current ? this.options.formatResultRef.current(res) : res;

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      devLog(`Req:Success ${this.serviceRef.current?.name} call`, { data: res, params });

      this.options.onSuccess?.(res, params);
      this.runPluginHandler("onSuccess", res, params);

      this.options.onFinally?.(params, res, undefined);

      if (currentCount === this.count) {
        this.runPluginHandler("onFinally", params, res, undefined);
      }

      return res;
    } catch (error) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => ({}));
      }

      this.setState({
        error: error as CustomAny,
        loading: false,
      });

      devLog(`Req:Error ${this.serviceRef.current?.name} call`, { error: error as CustomAny, params });
      this.options.onError?.(error as CustomAny, params);
      this.runPluginHandler("onError", error, params);

      this.options.onFinally?.(params, undefined, error as CustomAny);

      if (currentCount === this.count) {
        this.runPluginHandler("onFinally", params, undefined, error);
      }

      throw error;
    }
  }

  run(...params: TParams) {
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  cancel() {
    this.count += 1;
    this.setState({
      loading: false,
    });

    this.runPluginHandler("onCancel");
  }

  refresh() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.run(...(this.state.params || []));
  }

  refreshAsync() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.runAsync(...(this.state.params || []));
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data;
    this.runPluginHandler("onMutate", targetData);
    this.setState({
      data: targetData,
    });
  }
}
