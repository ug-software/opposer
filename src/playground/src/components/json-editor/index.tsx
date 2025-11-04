import AceEditor, { type IAceEditorProps } from "react-ace";

// Importa tema e modo (obrigatório!)
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";

export default (props: IAceEditorProps) => {

  return (
    <AceEditor
      {...props}
      mode="json"
      theme="dracula"
      name="readonly-json"
      fontSize={14}
      width="100%"
      highlightActiveLine={false}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{ $blockScrolling: true }}
    />
  );
}