'use client';
import {useEffect, useRef, useState} from 'react';
import {Button} from "@/components/ui/button";

type Props = {
  setVisibleDialog: (visible: boolean) => void;
}

const FormBuilder = ({setVisibleDialog}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [form, setForm] = useState<any>({
    components: []
  });

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

  const handleCloseDialog = () => {
    setVisibleDialog(false);
    setForm({
        components: []
      }
    )
  }

  const handleSaveForm = () => {
    setVisibleDialog(false);
    setForm({
        components: []
      }
    )
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
