

interface NoteProps {
  note: {
    content: string;
    createdAt: string;
    createdBy: string;
  };
}
const Note = ({ note }: NoteProps) => {


  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
      {/* Note content */}
      <div className="text-gray-800 mb-3 whitespace-pre-wrap">{note.content}</div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500">
          {note.createdAt}
        </div>
        <div className="flex items-center">
          <span className="text-gray-700 font-medium">{note.createdBy}</span>
        </div>
      </div>
    </div>
  );
};

export default Note;