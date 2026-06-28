import { Icon, Tooltip } from '@shopify/polaris';
import { DuplicateMinor, TickMinor } from '@shopify/polaris-icons';
import { memo, useState } from 'react';

interface ICopiedVariable {
  isCopied: boolean;
  value: string;
}

interface CopyIconProps {
  copiedText: string;
}

const CopyIcon = ({ copiedText }: CopyIconProps) => {
  const [copiedVariable, setCopiedVariable] = useState<ICopiedVariable>({
    isCopied: false,
    value: ''
  });
  const isCopied =
    copiedVariable.isCopied && copiedText === copiedVariable.value;

  const handleCopy = () => {
    setCopiedVariable((prev) => ({
      ...prev,
      isCopied: true,
      value: copiedText
    }));
    navigator.clipboard.writeText(copiedText);
    setTimeout(() => {
      setCopiedVariable((prev) => ({ ...prev, isCopied: false, value: '' }));
    }, 500);
  };

  return (
    <div style={{ cursor: isCopied ? 'auto' : 'pointer' }} onClick={handleCopy}>
      <Tooltip content="Copy">
        <Icon
          source={isCopied ? TickMinor : DuplicateMinor}
          tone={isCopied ? 'success' : 'base'}
        />
      </Tooltip>
    </div>
  );
};

export default memo(CopyIcon);
