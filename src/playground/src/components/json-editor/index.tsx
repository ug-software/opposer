import "./styles.css";

import { useEffect, useRef } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export default () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useRef<null | JSONEditor>(null);

  useEffect(() => {
    if(ref.current){
        editor.current = new JSONEditor(ref.current, {
          mode: 'code',
          mainMenuBar: false,
          onChange: () => {
            if(editor.current){
                console.log(editor.current.get());
            }
          },
        });
        editor.current.set({ hello: "world" });
    }

    return () => editor.current?.destroy();
  }, []);

  return <div ref={ref} className='json-editor-code'/>;
}
