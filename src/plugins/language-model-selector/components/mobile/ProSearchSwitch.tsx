import ProSearchIcon from "@/components/icons/ProSearchIcon";
import { Switch } from "@/components/ui/switch";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

export default function ProSearchSwitch() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { isProSearchEnabled, setIsProSearchEnabled } = context;

  return (
    <div
      className="x:flex x:w-full x:items-start x:justify-between x:gap-4 x:p-4"
      onClick={() => {
        setIsProSearchEnabled(!isProSearchEnabled);
      }}
    >
      <div
        className={cn(
          "x:flex x:items-start x:gap-2 x:transition-all",
          isProSearchEnabled && "x:text-primary",
        )}
      >
        <ProSearchIcon className="x:mt-1 x:size-4" />
        <div className="x:flex x:flex-col x:gap-y-1">
          <div className="x:text-lg x:font-medium">Pro</div>
          <div className="x:text-sm x:text-muted-foreground">
            {t(
              "plugin-model-selectors:languageModelSelector.proSearch.tooltip",
            )}
          </div>
        </div>
      </div>
      <Switch size="base" checked={isProSearchEnabled} />
    </div>
  );
}
