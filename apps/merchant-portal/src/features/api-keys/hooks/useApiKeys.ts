import { ChangeEvent, useState } from "react";
import { useCreateApiKey, useListApiKeys, useRevokeApiKey } from "./api-key.hooks";
import { ApiKey, ApiKeyMode } from "../types/api-key.type";
import { createApiKeySchema } from "../types/api-key.schema";

type FlowState = "list" | "create" | "revealed";
type FormErrors = { name?: string };

export const useApiKeysScreen = () => {
  const [flowState, setFlowState] = useState<FlowState>("list");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ApiKeyMode>("TEST");
  const [errors, setErrors] = useState<FormErrors>({});
  const [revealedSecret, setRevealedSecret] = useState("");
  const [revealedKey, setRevealedKey] = useState<ApiKey | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);

  const { data: apiKeys = [], isLoading } = useListApiKeys();

  const { mutate: createKey, isPending: isCreating } = useCreateApiKey(
    (key: ApiKey, secretKey: string) => {
      setRevealedSecret(secretKey);
      setRevealedKey(key);
      setFlowState("revealed");
    },
  );

  const { mutate: revokeKey, isPending: isRevoking } = useRevokeApiKey(() => {
    setRevokeTargetId(null);
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors({});
  };

  const handleStartCreate = () => {
    setName("");
    setMode("TEST");
    setErrors({});
    setFlowState("create");
  };

  const handleCancelCreate = () => setFlowState("list");

  const handleSubmitCreate = () => {
    const result = createApiKeySchema.safeParse({ name });
    if (!result.success) {
      setErrors({ name: result.error.issues[0].message });
      return;
    }
    createKey({ name: name.trim(), mode });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(revealedSecret);
    setHasCopied(true);
  };

  const handleDismissRevealed = () => {
    setRevealedSecret("");
    setRevealedKey(null);
    setHasCopied(false);
    setFlowState("list");
  };

  const handleRevokeConfirm = () => {
    if (!revokeTargetId) return;
    revokeKey(revokeTargetId);
  };

  return {
    flowState,
    apiKeys,
    isLoading,
    name,
    mode,
    setMode,
    errors,
    isCreating,
    revealedSecret,
    revealedKey,
    hasCopied,
    setHasCopied,
    revokeTargetId,
    setRevokeTargetId,
    isRevoking,
    handleNameChange,
    handleStartCreate,
    handleCancelCreate,
    handleSubmitCreate,
    handleCopySecret,
    handleDismissRevealed,
    handleRevokeConfirm,
  };
};
