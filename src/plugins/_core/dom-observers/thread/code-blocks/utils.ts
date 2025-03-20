import { sendMessage } from "webext-bridge/content-script";

import { threadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";

export async function parseCodeBlocks(
  messageBlocks: MessageBlock[],
): Promise<(CodeBlock | null)[][]> {
  const codeBlocksChunksPromises = messageBlocks.map(
    async (messageBlock, i) => {
      if (messageBlock == null) return [];

      const messageBlocksCount = messageBlocks.length;
      const codeBlocksCount =
        threadCodeBlocksDomObserverStore
          .getState()
          .codeBlocksChunks?.reduce((acc, codeBlocks) => {
            return acc + codeBlocks.length;
          }, 0) ?? 0;

      if (
        (messageBlocksCount > 15 || codeBlocksCount > 40) &&
        messageBlock.states.isInFlight
      )
        return [];

      const codeBlocksChunks = $(messageBlock.nodes.$answer)
        .find(DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.WRAPPER)
        .toArray();

      const codeBlocksPromises = codeBlocksChunks.map(async (codeBlock, j) => {
        const $codeBlock = $(codeBlock);

        $codeBlock
          .internalComponentAttr(
            INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK,
          )
          .attr("data-index", j);

        const $nativeCopyButton = $codeBlock.find(
          DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_COPY_BUTTON,
        );

        const content = await getCodeBlockContent({
          messageBlockIndex: i,
          codeBlockIndex: j,
          $wrapper: $codeBlock,
        });

        return {
          nodes: {
            $wrapper: $codeBlock,
            $nativeCopyButton,
          },
          content,
          states: {
            isInFlight: isCodeBlockInFlight({
              messageBlocks,
              messageBlockIndex: i,
              codeBlockIndex: j,
            }),
          },
        };
      });

      return await Promise.all(codeBlocksPromises);
    },
  );

  return Promise.all(codeBlocksChunksPromises);
}

async function getCodeBlockContent({
  messageBlockIndex,
  codeBlockIndex,
  $wrapper,
}: {
  messageBlockIndex: number;
  codeBlockIndex: number;
  $wrapper: JQuery<HTMLElement>;
}): Promise<CodeBlock["content"]> {
  const data = await sendMessage(
    "reactVdom:getCodeBlockContent",
    {
      messageBlockIndex,

      codeBlockIndex,
    },
    "window",
  );

  return {
    language:
      data?.language ??
      $wrapper.find(".text-text-200.font-thin:last").text() ??
      "text",
    code: data?.code ?? $wrapper.find("code:last").text() ?? "",
  };
}

function isCodeBlockInFlight({
  messageBlocks,

  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlocks: MessageBlock[];
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const isMessageBlockInFlight =
    messageBlocks[messageBlockIndex]?.states.isInFlight;

  if (!isMessageBlockInFlight) return false;

  const codeBlock = document.querySelector(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex}"]`,
  );

  let parentElement = codeBlock?.parentElement;

  const hasAnimationWrapper = parentElement?.classList.contains("animate-in");

  if (hasAnimationWrapper) {
    return parentElement?.nextElementSibling == null;
  }

  const hasNextCodeBlock = document.querySelector(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex + 1}"]`,
  );

  if (hasNextCodeBlock) return false;

  return codeBlock?.nextElementSibling == null;
}
