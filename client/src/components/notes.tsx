import { ReactNode, useEffect, useState } from "react";
import { fetchAll, Note, post } from "../api/notes";

const Row = ({
  children,
  style = {},
  ...rest
}: {
  children?: ReactNode;
  style?: object;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

const Col = ({
  children,
  style = {},
}: {
  children?: ReactNode;
  style?: object;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const NotesSuperLayout = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    fetchAll().then(setNotes);
  }, []);

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selected)!;

  return (
    <Row
      style={{
        backgroundColor: "#000009",
        width: "100vw",
        height: "100vh",
        color: "white",
      }}
    >
      <Col
        style={{
          backgroundColor: "#ff02",
          width: "20%",
          height: "100vh",
        }}
      >
        {notes.map((n) => {
          return (
            <Row
              onClick={() => {
                setSelected(n.id);
              }}
            >
              {n.title}
            </Row>
          );
        })}
      </Col>
      <Col
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        {selected ? (
          <NoteBody
            note={selectedNote}
            onBodyChange={(t) =>
              setNotes((ns) =>
                ns.map((nn) =>
                  nn.id === selectedNote.id ? { ...nn, body: t } : nn
                )
              )
            }
          />
        ) : null}
      </Col>
    </Row>
  );
};

const NoteBody = ({
  note,
  onBodyChange,
}: {
  note: Note | undefined;
  onBodyChange: (t: string) => void;
}) => {
  if (!note) return null;

  return (
    <Row>
      <input
        value={note.body}
        onChange={(event) => onBodyChange(event.target.value)}
      ></input>
      <button onClick={() => post(note.id, note)}>{"save"}</button>
    </Row>
  );
};
