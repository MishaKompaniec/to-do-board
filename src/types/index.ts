interface Task {
  id: string;
  text: string;
  status: string;
}

export interface ColumnProps {
  status: string;
  tasks: Task[];
  onDelete: (e: React.MouseEvent, id: string) => void;
  deletingId?: string | null;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface TodoType {
  id: string;
  text: string;
  status: string;
}
