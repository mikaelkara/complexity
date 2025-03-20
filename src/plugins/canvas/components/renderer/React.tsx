import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { Button } from "@/components/ui/button";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import styles from "@/plugins/canvas/components/renderer/sandpack.css?inline";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import { UiUtils } from "@/utils/ui-utils";

export default function ReactRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code;
  const isInFlight = selectedCodeBlock?.states.isInFlight;

  if (!code) {
    return null;
  }

  return (
    <MemoizedPreviewContainer code={code} isInFlight={isInFlight ?? false} />
  );
}

const MemoizedPreviewContainer = memo(function MemoizedPreviewContainer({
  code,
  isInFlight,
}: {
  code: string;
  isInFlight: boolean;
}) {
  useInsertCss({
    id: "sandpack",
    css: styles,
  });

  const previewRef = useRef<SandpackPreviewRef>(null);

  useEffect(() => {
    if (previewRef.current) {
      canvasStore.setState({
        sandpackPreviewRef: previewRef.current,
      });
    }
  }, []);

  return (
    <div id="sandpack-container" className="x:relative x:size-full">
      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            recharts: "2.15.0",
          },
        }}
        files={{
          "/App.js": isInFlight
            ? "export default function App() { return null; }"
            : code,
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
      >
        <SandpackLayout>
          <SandpackPreview
            ref={previewRef}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </SandpackLayout>
        <FixErrorButton />
      </SandpackProvider>
    </div>
  );
});

function FixErrorButton() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isAutonomousCanvas = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.content.language,
  );

  const title = formatCanvasTitle(
    getCanvasTitle(selectedCodeBlock?.content.language),
  );

  const { sandpack } = useSandpack();

  if (!sandpack.error) return null;

  return (
    <Button
      variant="destructive"
      className="x:absolute x:bottom-4 x:left-4 x:z-10 x:animate-in x:fade-in-0"
      onClick={() => {
        if (!sandpack.error) return;

        const $textarea = UiUtils.getActiveQueryBoxTextarea();

        if (!$textarea.length) return;

        const errorText = `${isAutonomousCanvas && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${sandpack.error.message}`;

        $textarea.trigger("focus");

        document.execCommand("insertText", false, errorText);
      }}
    >
      Fix Error
    </Button>
  );
}
