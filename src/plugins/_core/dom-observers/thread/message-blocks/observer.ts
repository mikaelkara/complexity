import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/_core/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "coreDomObserver:thread:messageBlocks",
  dependencies: ["messaging:namespaceSetup", "coreDomObserver:thread"],
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:thread:messageBlocks",
      })
    )
      return;

    observeThreadMessageBlocks();
  },
});

function cleanup() {
  DomObserver.destroy("thread:messageBlocks");
  threadMessageBlocksDomObserverStore.getState().resetStore();
}

function observeThreadMessageBlocks() {
  threadDomObserverStore.subscribe(
    (store) => store.$wrapper,
    ($threadWrapper) => {
      cleanup();

      if ($threadWrapper == null || !$threadWrapper.length) return;

      DomObserver.create("thread:messageBlocks", {
        target: $threadWrapper[0],
        config: { childList: true, subtree: true },
        fireImmediately: true,
        onMutation: () => {
          CallbackQueue.getInstance().enqueue(async () => {
            threadMessageBlocksDomObserverStore.setState({
              messageBlocks: await findMessageBlocks(),
            });
          }, "thread:messageBlocks");
        },
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}
