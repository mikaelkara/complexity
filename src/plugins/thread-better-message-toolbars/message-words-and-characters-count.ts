import { sendMessage } from "webext-bridge/content-script";

import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

const BADGE_COMPONENT_SELECTOR = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT}"]`;

function createAnswerHeadingContainer(content: string) {
  return $(`<div>${content}</div>`)
    .addClass(
      "x:text-muted-foreground x:text-xs x:ml-2 x:text-right x:font-medium x:max-w-[200px] x:md:max-w-max",
    )
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT,
    );
}

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:messageWordsAndCharactersCount",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ];

    if (
      !pluginsEnableStates["thread:betterMessageToolbars"] ||
      !settings.wordsAndCharactersCount
    )
      return;

    const shouldDisplayTokensCount =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ].tokensCount;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => store.messageBlocks,
      (messageBlocks) => {
        messageBlocks?.forEach(
          async (
            { nodes: { $answerHeading }, states: { isInFlight } },
            index,
          ) => {
            if (isInFlight) {
              $answerHeading.find(BADGE_COMPONENT_SELECTOR).remove();
              return;
            }

            const $existingBadge = $answerHeading.find(
              BADGE_COMPONENT_SELECTOR,
            );

            if ($existingBadge.length) {
              return;
            }

            const content = await sendMessage(
              "reactVdom:getMessageContent",
              { index },
              "window",
            );

            if (content == null) {
              return;
            }

            const answerWordsCount = content.answer.split(" ").length;
            const answerCharactersCount = content.answer.length;
            const answerTokensCount = Math.ceil(content.answer.length / 4);

            const answerWordsAndCharactersCountContainer =
              createAnswerHeadingContainer(
                `${answerWordsCount} ${t("common:misc.words")} | ${answerCharactersCount} ${t("common:misc.characters")}${shouldDisplayTokensCount ? ` | ~${answerTokensCount} tokens` : ""}`,
              );
            $answerHeading.append(answerWordsAndCharactersCountContainer);
          },
        );
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
