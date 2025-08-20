'use client';
import {useEffect, useRef, useState} from 'react';
import {Button} from "@/components/ui/button";

type Props = {
  setVisibleDialog: (visible: boolean) => void;
  onSave?: (schema: any) => void;
  onCancel?: () => void;
  initialForm?: any;
}

const FormBuilder = ({setVisibleDialog, onSave, onCancel, initialForm}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [form, setForm] = useState<any>(initialForm ?? { components: [] });

  useEffect(() => {
    // Allow parent to update initial form (e.g., edit mode prefill)
    if (initialForm && JSON.stringify(initialForm) !== JSON.stringify(form)) {
      setForm(initialForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialForm]);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FORM_BUILDER_CHANGE') {
        setForm(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Send form data to iframe when it changes
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_FORM_DATA',
        data: form
      }, '*');
    }
  }, [form]);

  const handleIframeLoad = () => {
    // Send initial form data when iframe loads
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_FORM_DATA',
        data: form
      }, '*');
    }
  };

  const resetAndClose = () => {
    setVisibleDialog(false);
    setForm({ components: [] });
  }

  const handleCloseDialog = () => {
    onCancel?.();
    resetAndClose();
  }

  const handleSaveForm = () => {
    // Emit the current form schema to parent before closing
    onSave?.(form);
    resetAndClose();
  }

  return (
    <div
      className="flex-[1_1_auto] flex flex-col gap-2 w-full bg-white"
    >
      <iframe
        ref={iframeRef}
        src="/form-builder.html"
        className="flex-[1_1_auto] w-full"
        onLoad={handleIframeLoad}
        title="Form Builder"
      />
      <div className="p-2 flex gap-4 justify-end px-4">
        <Button variant="destructive" onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSaveForm}>Save form</Button>
      </div>
    </div>
  );
};

export default FormBuilder;
