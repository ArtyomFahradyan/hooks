import { useRef } from "react";
import { CustomAny } from "types";
import { useUpdateEffect } from "../../../useUpdateEffect";
import type { Plugin } from "../types";

// support refreshDeps & ready
const useAutoRunPlugin: Plugin<CustomAny, CustomAny[]> = (
  fetchInstance,
  {
    manual,
    ready = true,
    defaultParams = [],
    refreshDeps = [],
    refreshDepsAction,
  }
) => {
  const hasAutoRun = useRef(false);
  hasAutoRun.current = false;

  useUpdateEffect(() => {
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run(...defaultParams);
    }
  }, [ready]);

  useUpdateEffect(() => {
    if (hasAutoRun.current) {
      return;
    }
    if (!manual) {
      hasAutoRun.current = true;
      if (refreshDepsAction) {
        refreshDepsAction();
      } else {
        fetchInstance.refresh();
      }
    }
  }, [...refreshDeps]);

  return {
    onBefore: () => {
      if (!ready) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: !manual && ready,
  };
};

export default useAutoRunPlugin;
