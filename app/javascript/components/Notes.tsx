import React, { ReactNode, useEffect, useRef, useState } from "react";
import { create, fetchAll, Note, post, remove } from "../api/notes";
import { colors } from "./ds/colors";

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

const usePrevious = (value: unknown) => {
  const ref = useRef();
  const ref2 = useRef();

  useEffect(() => {
    ref.current = ref2.current;
    ref2.current = value;
  }, [value]);

  return ref.current;
};

export const NotesSuperLayout = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<number>();
  const [dirty, setDirty] = useState<number>();

  const timer = useRef<NodeJS.Timeout>();

  const selectedNote = notes.find((n) => n.id === selected)!;

  useEffect(() => {
    fetchAll().then(setNotes);
  }, []);

  useEffect(() => {
    console.log("notes", notes);
  }, [notes]);

  useEffect(() => {
    if (selectedNote) {
      timer.current = setTimeout(async () => {
        console.log("saving from timeout", selectedNote.body);
        const title = selectedNote.body.split("\n")[0];
        const fromServer = await post(selected, { ...selectedNote, title });
        console.log("FROM SERVER:", fromServer);
        setNotes((n) =>
          // TODO: this is creating another save
          n
            .map((nn) => (nn.id === fromServer.id ? fromServer : nn))
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        );
      }, 2000);
    }

    return () => {
      clearTimeout(timer.current);
      if (selectedNote) {
        // console.log("saving from cleanup", selectedNote.body);
        // post(selected, selectedNote);
      }
    };
  }, [dirty, selectedNote?.body]);

  const onDelete = async (id: number) => {
    setNotes((n) => n.filter((nn) => nn.id !== id));
    await remove(id);
  };

  return (
    <Row
      style={{
        backgroundColor: colors.midBg,
        width: "100vw",
        height: "100vh",
        color: colors.content,
      }}
    >
      <Col
        style={{
          backgroundColor: colors.deepBg,
          width: "20%",
          height: "100vh",
          paddingTop: "1em",
          paddingBottom: "1em",
        }}
      >
        {notes.map((n) => {
          return (
            <TitleItem note={n} onSelect={setSelected} onDelete={onDelete} />
          );
        })}
        <HoverRow
          style={{ justifySelf: "flex-end", justifyContent: "space-around" }}
        >
          {() => (
            <Button
              onClick={async () => {
                const newNote = await create({});
                console.log("new:", newNote);
                setNotes((n) => [newNote, ...n]);
                setSelected(newNote.id);
              }}
            >
              {"New note"}
            </Button>
          )}
        </HoverRow>
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
            onBodyChange={(t) => {
              setDirty(selected);
              setNotes((ns) =>
                ns.map((nn) =>
                  nn.id === selectedNote.id ? { ...nn, body: t } : nn
                )
              );
            }}
          />
        ) : null}
      </Col>
    </Row>
  );
};

const HoverRow = (
  props: {
    children: (isHover: boolean) => ReactNode;
  } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  const [isHover, setIsHover] = useState(false);

  const { children, style = {}, ...rest } = props;

  const bgStyle = isHover
    ? {
        backgroundColor: colors.highBg,
      }
    : {};

  return (
    <Row
      style={{
        padding: "1em",
        justifyContent: "space-between",
        ...bgStyle,
        ...style,
      }}
      {...rest}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children(isHover)}
    </Row>
  );
};

const TitleItem = (props: {
  note: Note;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <HoverRow
      title={props.note.title}
      style={{
        padding: "1em",
        justifyContent: "space-between",
      }}
      onClick={() => {
        props.onSelect(props.note.id);
      }}
    >
      {(isHover) => (
        <>
          <Col
            style={{
              height: "2em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <P>{props.note.title || "untitled"}</P>
          </Col>
          {isHover ? (
            <Col>
              <Button
                style={{ height: "2em" }}
                onClick={() => props.onDelete(props.note.id)}
              >
                {"x"}
              </Button>
            </Col>
          ) : null}
        </>
      )}
    </HoverRow>
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
    <Row
      style={{
        height: "100%",
      }}
    >
      <textarea
        value={note.body}
        onChange={(event) => onBodyChange(event.target.value)}
        style={{
          backgroundColor: colors.midBg,
          color: colors.content,
          outline: "none",
          resize: "none",
          padding: "1em",
          height: "100%",
          width: "100%",
          fontFamily: "Fira Code",
        }}
      ></textarea>
    </Row>
  );
};

const Button = (
  props: { children: ReactNode } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >
) => {
  const { children, style = {}, ...rest } = props;
  return (
    <button
      style={{
        backgroundColor: "transparent",
        color: colors.content,
        border: "none",
        cursor: "pointer",
        ...style,
      }}
      {...(rest || {})}
    >
      {children}
    </button>
  );
};

const P = ({ children }: { children: string }) => {
  return (
    <p
      style={{
        color: colors.content,
        fontFamily: "Fira Code",
      }}
    >
      {children}
    </p>
  );
};
