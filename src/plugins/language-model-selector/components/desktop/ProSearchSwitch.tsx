import ProSearchIcon from "@/components/icons/ProSearchIcon";
import { Switch } from "@/components/ui/switch";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

export default function ProSearchSwitch() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { isProSearchEnabled, setIsProSearchEnabled } = context;

  return (
    <div
      className="x:flex x:w-full x:cursor-pointer x:items-start x:justify-between x:gap-8 x:rounded-md x:p-2 x:transition-all x:hover:bg-primary-foreground"
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
        <ProSearchIcon className="x:mt-0.5 x:size-3.5" />
        <div className="x:flex x:flex-col x:gap-y-0.5">
          <div className="x:text-sm x:font-medium">Pro</div>
          <div className="x:text-xs x:text-muted-foreground">
            {t(
              "plugin-model-selectors:languageModelSelector.proSearch.tooltip",
            )}
          </div>
        </div>
      </div>
      <Switch size="sm" checked={isProSearchEnabled} />
    </div>
  );
}
