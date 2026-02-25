import styles from './NewTask.module.scss';

export function NewTask({ className = '' }: { className?: string }) {
  const handleAddTask = () => {
    console.log('add task');
  };

  return (
    <button
      className={`${styles.newTask} flex items-center gap-2 ${styles[className]}`}
      onClick={handleAddTask}
    >
      <i className="material-icons-outlined">add</i> New Task
    </button>
  );
}
