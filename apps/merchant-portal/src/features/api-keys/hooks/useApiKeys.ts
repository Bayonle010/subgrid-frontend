import { ChangeEvent, useState } from "react";
import { useCreateApiKey, useListApiKeys, useRevokeApiKey } from "./api-key.hooks";
import { ApiKey, ApiKeyEnvironment, ApiKeyScope, CreateApiKeyResponse } from "../types/api-key.type";
import { createApiKeySchema } from "../types/api-key.schema";

type FlowState = "list" | "create" | "revealed";

type FormErrors = { name?: string };

export const useApiKeysScreen = () => {
  const [flowState, setFlowState] = useState<FlowState>("list");
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<ApiKeyEnvironment>("live");
  const [scope, setScope] = useState<ApiKeyScope>("full_access");
  const [errors, setErrors] = useState<FormErrors>({});
  const [revealedSecret, setRevealedSecret] = useState("");
  const [revealedKey, setRevealedKey] = useState<ApiKey | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);

  const { data: apiKeys = [], isLoading } = useListApiKeys();

  const { mutate: createKey, isPending: isCreating } = useCreateApiKey(
    (data: CreateApiKeyResponse) => {
      setRevealedSecret(data.secret);
      setRevealedKey(data.key);
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
    setEnvironment("live");
    setScope("full_access");
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
    createKey({ name: name.trim(), environment, scope });
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
    revokeKey({ key_id: revokeTargetId });
  };

  return {
    flowState,
    apiKeys,
    isLoading,
    name,
    environment,
    setEnvironment,
    scope,
    setScope,
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
