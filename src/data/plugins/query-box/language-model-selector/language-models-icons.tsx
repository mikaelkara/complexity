import {
  SiAnthropic,
  SiGooglegemini,
  SiOpenai,
  SiPerplexity,
} from "react-icons/si";

import DeepSeek from "@/components/icons/DeepSeek";
import FaAtom from "@/components/icons/FaAtom";
import XAiIcon from "@/components/icons/XAiIcon";
import { LanguageModelProvider } from "@/data/plugins/query-box/language-model-selector/language-models.types";

export const languageModelProviderIcons: Record<
  LanguageModelProvider,
  React.ElementType
> = {
  Anthropic: SiAnthropic,
  OpenAI: SiOpenai,
  xAI: XAiIcon,
  Perplexity: SiPerplexity,
  PerplexityDeepResearch: FaAtom,
  Google: SiGooglegemini,
  DeepSeek: DeepSeek,
};
